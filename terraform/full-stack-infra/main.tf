terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    key    = "full-stack-infra/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  region = "eu-west-1"
  alias  = "eu_central_1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}

module "domain" {
  source      = "../modules/domain"
  domain_name = var.domain_name

  providers = {
    aws.eu_central_1 = aws.eu_central_1
    aws.us_east_1    = aws.us_east_1
  }
}



# Create S3 bucket for Lambda artifacts

