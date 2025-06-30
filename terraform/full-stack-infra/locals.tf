locals {
  project_prefix = "${var.project_name}-${var.project_environment}"
  account_id     = data.aws_caller_identity.current.account_id
}
