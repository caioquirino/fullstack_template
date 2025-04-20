# Create S3 bucket for static resources using the terraform-aws-modules/s3-bucket/aws module
module "static_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.7.0"

  count = var.create_static_bucket ? 1 : 0

  bucket = var.static_bucket_name

  # Disable ACLs and use bucket ownership controls
  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"
  acl                      = null

  # Enable versioning
  versioning = {
    enabled = var.static_bucket_versioning
  }

  # Configure lifecycle rules
  lifecycle_rule = var.static_bucket_lifecycle_rules

  # Configure CORS
  cors_rule = var.static_bucket_cors_rules

  # Configure server-side encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  # Block public access
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # Configure bucket policy
  attach_policy = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontOAC"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${var.static_bucket_name != null ? var.static_bucket_name : "${var.name}-static-${data.aws_caller_identity.current.account_id}"}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = var.cloudfront_distribution_id != null ? "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.cloudfront_distribution_id}" : "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*"
          }
        }
      }
    ]
  })

  tags = var.static_bucket_tags
}

# Create a null resource to sync static files to the bucket
resource "null_resource" "static_files_sync" {
  for_each = var.create_static_bucket ? { for idx, file in var.static_files : idx => file } : {}

  triggers = {
    timestamp = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOF
      aws s3 sync ${each.value.source_path} s3://${local.static_bucket_name}/${each.value.destination_path} \
        ${each.value.cache_control != null ? "--cache-control \"${each.value.cache_control}\"" : ""} \
        --delete \
        --quiet
    EOF
  }

  depends_on = [module.static_bucket, aws_lambda_function.function]
}