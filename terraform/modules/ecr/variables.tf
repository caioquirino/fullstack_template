variable "repository_name" {
  description = "Name of the ECR repository"
  type        = string
}

variable "image_tag_mutability" {
  description = "The tag mutability setting for the repository. Must be one of: MUTABLE or IMMUTABLE"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Indicates whether images are scanned after being pushed to the repository"
  type        = bool
  default     = true
}

variable "lifecycle_policy" {
  description = "Lifecycle policy for the repository"
  type = object({
    rules = list(object({
      rulePriority = number
      description  = string
      selection = object({
        tagStatus   = string
        countType   = string
        countNumber = number
      })
      action = object({
        type = string
      })
    }))
  })
} 