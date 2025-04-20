# Build and push Docker image to ECR
resource "null_resource" "docker_build" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    working_dir = var.build.working_dir

    environment = merge({
      ECR_REGISTRY = var.build.ecr_registry
    }, var.build.environment_variables)

    command = <<EOF
      # Login to ECR
      aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin $ECR_REGISTRY
      
      # Build and tag
      ${coalesce(var.build.command, "docker build -t ${var.docker_tag} .")}
      
      # Push to ECR
      docker push ${var.docker_tag}
    EOF
  }
}

# Create Lambda function
resource "aws_lambda_function" "function" {
  function_name = var.name
  package_type  = "Image"
  image_uri     = var.docker_tag
  role          = aws_iam_role.lambda_execution_role.arn
  timeout       = var.runtime_timeout
  memory_size   = var.runtime_memory_size

  environment {
    variables = {
      NODE_ENV     = "production"
      AWS_LWA_PORT = "3000"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy_attachment.lambda_logs,
    null_resource.docker_build
  ]
}

# Create IAM role for Lambda execution
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic execution policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Attach CloudWatch Logs policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Create API Gateway V2 HTTP API
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.name}-api"
  protocol_type = "HTTP"
  description   = "HTTP API for ${var.name} Lambda function"
}

# Create API Gateway V2 stage
resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      ip               = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      httpMethod       = "$context.httpMethod"
      routeKey         = "$context.routeKey"
      status           = "$context.status"
      protocol         = "$context.protocol"
      responseTime     = "$context.responseLatency"
      integrationError = "$context.integration.error"
    })
  }
}

# Create CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.name}-api"
  retention_in_days = 7
}

# Create API Gateway V2 integration with Lambda
resource "aws_apigatewayv2_integration" "integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Lambda integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.function.invoke_arn
}

# Create API Gateway V2 route
resource "aws_apigatewayv2_route" "route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.integration.id}"
}

# Create API Gateway V2 route for root path
resource "aws_apigatewayv2_route" "route_root" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.integration.id}"
}

# Create Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
} 