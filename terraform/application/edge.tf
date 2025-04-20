# Create CloudFront distribution using the terraform-aws-modules/cloudfront/aws module
module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "4.1.0"

  comment             = "CloudFront distribution for ${local.project_prefix} frontend"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100" # Use only North America and Europe
  retain_on_delete    = false
  wait_for_deployment = false

  # Origin configuration
  origin = {
    frontend_api_gateway = {
      domain_name = replace(module.frontend.api_endpoint, "https://", "")
      custom_origin_config = {
        http_port                = 80
        https_port               = 443
        origin_protocol_policy   = "https-only"
        origin_ssl_protocols     = ["TLSv1.2"]
        origin_keepalive_timeout = 60
        origin_read_timeout      = 60
        origin_connect_timeout   = 10
        origin_shield_enabled    = false
      }
    }
    graphql_api_gateway = {
      domain_name = replace(module.api_gateway.api_endpoint, "https://", "")
      custom_origin_config = {
        http_port                = 80
        https_port               = 443
        origin_protocol_policy   = "https-only"
        origin_ssl_protocols     = ["TLSv1.2"]
        origin_keepalive_timeout = 60
        origin_read_timeout      = 60
        origin_connect_timeout   = 10
        origin_shield_enabled    = false
      }
    }
    static_bucket = {
      domain_name           = module.frontend.static_bucket_regional_domain_name
      origin_access_control = "static-bucket-access"
    }
  }

  # Create origin access control for S3 bucket
  create_origin_access_identity = false
  create_origin_access_control  = true
  origin_access_control = {
    "static-bucket-access" = {
      description      = "CloudFront access control for ${local.project_prefix} static bucket"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  # Default cache behavior
  default_cache_behavior = {
    target_origin_id         = "frontend_api_gateway"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
    use_forwarded_values     = false
  }

  # Ordered cache behaviors
  ordered_cache_behavior = [
    # Cache behavior for GraphQL API
    {
      path_pattern             = "/graphql"
      target_origin_id         = "graphql_api_gateway"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
      use_forwarded_values     = false
    },
    # Cache behavior for _next/static from S3
    {
      path_pattern             = "/_next/static/*"
      target_origin_id         = "static_bucket"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
      use_forwarded_values     = false
    },
    # Cache behavior for public assets from S3
    {
      path_pattern             = "/public/*"
      target_origin_id         = "static_bucket"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
      use_forwarded_values     = false
    },
    # Cache behavior for API routes
    {
      path_pattern             = "/api/*"
      target_origin_id         = "frontend_api_gateway"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
      use_forwarded_values     = false
    },
    # Cache behavior for _next/data
    {
      path_pattern             = "/_next/data/*"
      target_origin_id         = "frontend_api_gateway"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
      use_forwarded_values     = false
    },
    # Default cache behavior for all other paths
    {
      path_pattern             = "/*"
      target_origin_id         = "frontend_api_gateway"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
      use_forwarded_values     = false
    }
  ]

  # Viewer certificate
  viewer_certificate = {
    acm_certificate_arn      = data.terraform_remote_state.full_stack_infra.outputs.domain_certificates.us_east_1.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Domain configuration
  aliases = [data.terraform_remote_state.full_stack_infra.outputs.domain_hosted_zones.name]

  # Logging configuration
  logging_config = {
    bucket = module.cloudfront_logs.s3_bucket_bucket_domain_name
    prefix = "${local.project_prefix}-frontend/"
  }
}

# Data sources for AWS-managed Cache Policies
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# Data sources for AWS-managed Origin Request Policies
data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host_header" {
  name = "Managed-AllViewerExceptHostHeader"
}

# Create S3 bucket for CloudFront logs using the terraform-aws-modules/s3-bucket/aws module
module "cloudfront_logs" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.6.0"

  bucket = "${local.project_prefix}-cloudfront-logs-${data.aws_caller_identity.current.account_id}"

  # Enable ACLs for the bucket
  control_object_ownership = true
  object_ownership         = "ObjectWriter"

  # Set ACL to private
  acl = "private"

  # Enable versioning to prevent accidental deletion of logs
  versioning = {
    enabled = true
  }

  # Configure lifecycle rules to manage storage costs
  lifecycle_rule = [
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
    },
    {
      id      = "transition-to-glacier"
      enabled = true
      transition = [
        {
          days          = 90
          storage_class = "GLACIER"
        }
      ]
      filter = {
        prefix = ""
      }
    },
    {
      id      = "expire-old-logs"
      enabled = true
      expiration = {
        days = 365
      }
      filter = {
        prefix = ""
      }
    }
  ]

  # Configure server-side encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  # Configure bucket policy to allow CloudFront to write logs
  attach_policy = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:PutObject"
        Resource  = "arn:aws:s3:::${local.project_prefix}-cloudfront-logs-${data.aws_caller_identity.current.account_id}/*"
      }
    ]
  })
}

# Create CloudWatch log group for CloudFront
resource "aws_cloudwatch_log_group" "cloudfront" {
  name              = "/aws/cloudfront/${local.project_prefix}-frontend"
  retention_in_days = 30
}

# Create CloudFront invalidation to ensure clean deployments
resource "null_resource" "cloudfront_invalidation" {
  # Trigger the invalidation when the GitHub SHA changes
  triggers = {
    github_sha = var.github_sha
  }

  # Use local-exec provisioner to create the invalidation using AWS CLI
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${module.cloudfront.cloudfront_distribution_id} --paths '/*'"
  }
}
