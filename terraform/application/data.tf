data "aws_caller_identity" "current" {}

data "terraform_remote_state" "full_stack_infra" {
  backend = "s3"
  config = {
    bucket = "${data.aws_caller_identity.current.account_id}-terraform-state"
    key    = "full-stack-infra/terraform.tfstate"
    region = "eu-central-1"
  }
}

data "aws_ecr_authorization_token" "token" {}

data "aws_route53_zone" "this" {
  name = data.terraform_remote_state.full_stack_infra.outputs.domain_hosted_zones.name
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

data "aws_region" "current" {}