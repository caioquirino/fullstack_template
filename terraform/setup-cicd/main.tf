terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    key    = "setup_cicd/terraform.tfstate"
    region = "eu-central-1"
  }
}

variable "repository" {
  type        = string
  description = "GitHub repository in format 'organization/repository'"
  validation {
    condition     = can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.repository))
    error_message = "Repository must be in the format 'organization/repository', e.g. 'myorg/myrepo'"
  }
}

data "aws_caller_identity" "current" {}

provider "aws" {
  region = "eu-central-1"
}

module "github_actions_oidc" {
  source = "../modules/github-actions-oidc"

  role_name = "${lower(replace(var.repository, "/", "-"))}-github-actions"
  repository_subjects = [
    "repo:${var.repository}:ref:refs/heads/main",
    "repo:${var.repository}:pull_request"
  ]
  policy_arns = [
    "arn:aws:iam::aws:policy/AdministratorAccess"
  ]
} 