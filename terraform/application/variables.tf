variable "project_name" {
  type    = string
  default = "fullstack-template"
}

variable "project_environment" {
  type    = string
  default = "dev"
}

variable "github_sha" {
  description = "The GitHub SHA of the current commit"
  type        = string
}

variable "aws_region" {
  description = "The AWS region to use"
  type        = string
  default     = "eu-west-1"
}

variable "stytch_project_id" {
  description = "The Stytch project ID"
  type        = string
  sensitive   = true
}

variable "stytch_secret_key" {
  description = "The Stytch secret key"
  type        = string
  sensitive   = true
}

variable "stytch_project_env" {
  description = "The Stytch project environment (test or live)"
  type        = string
  default     = "test"
}
