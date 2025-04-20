output "api_endpoint" {
  description = "The endpoint URL of the API Gateway"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "lambda_function_name" {
  description = "The name of the Lambda function"
  value       = aws_lambda_function.function.function_name
}

output "lambda_function_arn" {
  description = "The ARN of the Lambda function"
  value       = aws_lambda_function.function.arn
}

output "lambda_function_invoke_arn" {
  description = "The invocation ARN of the Lambda function"
  value       = aws_lambda_function.function.invoke_arn
}

output "lambda_function_qualified_arn" {
  description = "The qualified ARN of the Lambda function"
  value       = aws_lambda_function.function.qualified_arn
}

output "lambda_function_version" {
  description = "The version of the Lambda function"
  value       = aws_lambda_function.function.version
}

output "lambda_function_role_arn" {
  description = "The ARN of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.arn
}

output "lambda_function_role_name" {
  description = "The name of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.name
}

output "lambda_function_role_id" {
  description = "The ID of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.id
}

output "lambda_function_role_unique_id" {
  description = "The unique ID of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.unique_id
}

output "lambda_function_role_create_date" {
  description = "The creation date of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.create_date
}

output "lambda_function_role_description" {
  description = "The description of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.description
}

output "lambda_function_role_path" {
  description = "The path of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.path
}

output "lambda_function_role_tags_all" {
  description = "The tags of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.tags_all
}

output "lambda_function_role_tags" {
  description = "The tags of the Lambda function's IAM role"
  value       = aws_iam_role.lambda_execution_role.tags
}

output "api_gateway_id" {
  description = "The ID of the API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_gateway_execution_arn" {
  description = "The execution ARN of the API Gateway"
  value       = aws_apigatewayv2_api.api.execution_arn
}

# S3 bucket outputs (only if bucket is created)
output "static_bucket_id" {
  description = "The name of the S3 bucket for static resources"
  value       = var.create_static_bucket ? module.static_bucket[0].s3_bucket_id : null
}

output "static_bucket_arn" {
  description = "The ARN of the S3 bucket for static resources"
  value       = var.create_static_bucket ? module.static_bucket[0].s3_bucket_arn : null
}

output "static_bucket_domain_name" {
  description = "The domain name of the S3 bucket for static resources"
  value       = var.create_static_bucket ? module.static_bucket[0].s3_bucket_bucket_domain_name : null
}

output "static_bucket_regional_domain_name" {
  description = "The regional domain name of the S3 bucket for static resources"
  value       = var.create_static_bucket ? module.static_bucket[0].s3_bucket_bucket_regional_domain_name : null
} 