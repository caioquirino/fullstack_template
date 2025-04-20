variable "name" {
  description = "Name to be used as prefix for all resources"
  type        = string
}

variable "build" {
  description = "Build configuration for the Docker image"
  type = object({
    working_dir           = optional(string, ".")
    environment_variables = optional(map(string), {})
    command               = optional(string)
    ecr_registry          = string
  })
}

variable "docker_tag" {
  description = "Docker image tag"
  type        = string
}

variable "runtime_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

variable "runtime_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 512
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "create_static_bucket" {
  description = "Whether to create an S3 bucket for static resources"
  type        = bool
  default     = false
}

variable "static_bucket_name" {
  description = "Name of the S3 bucket for static resources."
  type        = string
}

variable "static_bucket_versioning" {
  description = "Whether to enable versioning on the static bucket"
  type        = bool
  default     = true
}

variable "static_bucket_lifecycle_rules" {
  description = "List of lifecycle rules for the static bucket"
  type = list(object({
    id      = string
    enabled = bool
    transition = optional(list(object({
      days          = number
      storage_class = string
    })), [])
    expiration = optional(object({
      days = number
    }), null)
    filter = object({
      prefix = string
    })
  }))
  default = []
}

variable "static_bucket_cors_rules" {
  description = "List of CORS rules for the static bucket"
  type = list(object({
    allowed_headers = list(string)
    allowed_methods = list(string)
    allowed_origins = list(string)
    expose_headers  = list(string)
    max_age_seconds = number
  }))
  default = []
}

variable "static_bucket_tags" {
  description = "Tags to apply to the static bucket"
  type        = map(string)
  default     = {}
}

variable "static_files" {
  description = "List of static files or directories to upload to the S3 bucket"
  type = list(object({
    source_path      = string
    destination_path = string
    cache_control    = optional(string, null)
  }))
  default = []
}

variable "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution to use in the S3 bucket policy"
  type        = string
  default     = null
} 