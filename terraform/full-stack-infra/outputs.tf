output "domain_hosted_zones" {
  description = "Map of hosted zone information"
  value       = module.domain.hosted_zones
}

output "domain_certificates" {
  description = "Map of certificate information for each region"
  value       = module.domain.certificates
}

output "ecr" {
  description = "All ECR repository information"
  value = {
    url  = module.ecr.repository_url
    arn  = module.ecr.repository_arn
    name = module.ecr.repository_name
  }
}

output "ecs" {
  description = "All ECS cluster information"
  value = {
    cluster = {
      id   = module.ecs.cluster_id
      name = module.ecs.cluster_name
      arn  = module.ecs.cluster_arn
    }
    cloudwatch = {
      log_group_name = module.ecs.cloudwatch_log_group_name
      log_group_arn  = module.ecs.cloudwatch_log_group_arn
    }
  }
}

output "lambda_artifacts_bucket" {
  description = "S3 bucket for storing Lambda artifacts"
  value = {
    name = module.lambda_artifacts_bucket.s3_bucket_id
    arn  = module.lambda_artifacts_bucket.s3_bucket_arn
  }
} 