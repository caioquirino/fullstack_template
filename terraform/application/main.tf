terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
  backend "s3" {
    key    = "application/terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  region = "eu-central-1"
  alias  = "application"
}

provider "aws" {
  region = "eu-central-1"
  alias  = "eu_central_1"
  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
  default_tags {
    tags = local.default_tags
  }
}


locals {
  default_tags = merge(
    aws_servicecatalogappregistry_application.application.application_tag,
    {
      Environment = "Production"
      Project     = var.project_name
    }
  )
}

resource "aws_servicecatalogappregistry_application" "application" {
  provider    = aws.application
  name        = var.project_name
  description = "Application for ${var.project_name}"
}
