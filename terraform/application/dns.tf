resource "aws_route53_record" "cloudfront" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = data.terraform_remote_state.full_stack_infra.outputs.domain_hosted_zones.name
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
resource "aws_route53_record" "cloudfront_aaaa" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = data.terraform_remote_state.full_stack_infra.outputs.domain_hosted_zones.name
  type    = "AAAA"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}