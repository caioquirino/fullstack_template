# Output the API Gateway endpoint
output "frontend_api_endpoint" {
  value       = module.frontend.api_endpoint
  description = "The endpoint URL of the frontend API Gateway"
}

# Output the static bucket information
output "frontend_static_bucket_name" {
  value       = module.frontend.static_bucket_id
  description = "The name of the S3 bucket for frontend static resources"
}

output "frontend_static_bucket_domain_name" {
  value       = module.frontend.static_bucket_domain_name
  description = "The domain name of the S3 bucket for frontend static resources"
} 