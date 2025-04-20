locals {
  static_bucket_name = var.static_bucket_name != null ? var.static_bucket_name : "${var.name}-static-${data.aws_caller_identity.current.account_id}"
}