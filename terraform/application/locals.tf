locals {
  project_prefix       = "${var.project_name}-${var.project_environment}"
  lambda_function_name = "${local.project_prefix}-graphql"
  frontend_image_name  = "${data.terraform_remote_state.full_stack_infra.outputs.ecr.url}:frontend-${var.github_sha}"
}