module "frontend" {
  source = "../modules/serverless-nextjs"

  name                = "${local.project_prefix}-frontend"
  aws_region          = data.aws_region.current.name
  docker_tag          = local.frontend_image_name
  runtime_timeout     = 30
  runtime_memory_size = 512

  build = {
    working_dir  = "${path.root}/../../apps/frontend"
    ecr_registry = data.terraform_remote_state.full_stack_infra.outputs.ecr.url
  }

  # Enable static bucket creation
  create_static_bucket = true
  static_bucket_name   = "${local.project_prefix}-frontend-static-${data.aws_caller_identity.current.account_id}"

  # Configure static files to be copied to the bucket
  static_files = [
    {
      source_path      = "${path.root}/../../apps/frontend/.next/static"
      destination_path = "_next/static"
      content_type     = "application/javascript"
      cache_control    = "max-age=31536000"
    },
    {
      source_path      = "${path.root}/../../apps/frontend/public"
      destination_path = "public"
      content_type     = null
      cache_control    = "max-age=31536000"
    }
  ]

  # Configure CORS for the static bucket
  static_bucket_cors_rules = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3600
    }
  ]

  # Configure lifecycle rules for the static bucket
  static_bucket_lifecycle_rules = [
    {
      id      = "transition-to-ia"
      enabled = true
      transition = [
        {
          days          = 30
          storage_class = "STANDARD_IA"
        }
      ]
      filter = {
        prefix = ""
      }
    }
  ]

  # Pass the CloudFront distribution ID
  cloudfront_distribution_id = module.cloudfront.cloudfront_distribution_id
}

