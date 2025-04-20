module "lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "7.20.1"

  function_name = local.lambda_function_name
  description   = "GraphQL API Lambda function for ${local.project_prefix}"
  handler       = "lambda.handler"
  runtime       = "nodejs22.x"
  architectures = ["arm64"] # Using ARM64 for better performance and lower cost

  create_package = true

  source_path = [
    "${path.module}/../../apps/backend/dist/assets",
    "${path.module}/../../apps/backend/dist-bundle/lambda.js",
  ]

  publish = true

  environment_variables = {
    STYTCH_PROJECT_ID  = var.stytch_project_id
    STYTCH_SECRET_KEY  = var.stytch_secret_key
    STYTCH_PROJECT_ENV = var.stytch_project_env
  }

  allowed_triggers = {
    APIGatewayV2 = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.api_execution_arn}/*/*/*"
    }
  }

  cloudwatch_logs_retention_in_days = 30
  memory_size                       = 512
  timeout                           = 30

  attach_policy_json = true
  policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = [
          module.jargons_table.dynamodb_table_arn,
          "${module.jargons_table.dynamodb_table_arn}/index/*"
        ]
      }
    ]
  })

  tags = {
    Name = local.lambda_function_name
  }
}

# Create HTTP API Gateway V2
module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "5.2.1"

  name          = local.lambda_function_name
  description   = "HTTP API Gateway for ${local.project_prefix} GraphQL API"
  protocol_type = "HTTP"

  create_domain_name    = false
  create_domain_records = false

  cors_configuration = {
    allow_headers = [
      "content-type",
      "x-amz-date",
      "authorization",
      "x-api-key",
      "x-amz-security-token",
      "x-amz-user-agent"
    ]
    allow_methods = ["*"]
    allow_origins = ["*"]
    max_age       = 3600
  }


  # Access logs
  stage_access_log_settings = {
    create_log_group            = true
    log_group_retention_in_days = 30
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      errorMessage   = "$context.integrationErrorMessage"
    })
  }

  # Routes and integrations
  routes = {
    "ANY /graphql" = {
      integration = {
        uri                    = module.lambda_function.lambda_function_invoke_arn
        payload_format_version = "2.0"
        integration_method     = "POST"
        timeout_milliseconds   = 30000

      }
    }
  }
}
