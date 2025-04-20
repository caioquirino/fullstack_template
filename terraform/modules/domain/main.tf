resource "aws_route53_zone" "this" {
  name = var.domain_name
}

# ACM Certificate for eu-central-1
resource "aws_acm_certificate" "eu_central_1" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${var.domain_name}"
  ]

  provider = aws.eu_central_1
}

# ACM Certificate for US-EAST-1
resource "aws_acm_certificate" "us_east_1" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${var.domain_name}"
  ]

  provider = aws.us_east_1
}

# DNS validation records for eu-central-1 certificate
resource "aws_route53_record" "eu_central_1_validation" {
  for_each = {
    for dvo in aws_acm_certificate.eu_central_1.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.this.zone_id
}

# DNS validation records for US-EAST-1 certificate
resource "aws_route53_record" "us_east_1_validation" {
  for_each = {
    for dvo in aws_acm_certificate.us_east_1.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.this.zone_id
}

# Certificate validation for eu-central-1
resource "aws_acm_certificate_validation" "eu_central_1" {
  certificate_arn         = aws_acm_certificate.eu_central_1.arn
  validation_record_fqdns = [for record in aws_route53_record.eu_central_1_validation : record.fqdn]
  provider                = aws.eu_central_1
}

# Certificate validation for US-EAST-1
resource "aws_acm_certificate_validation" "us_east_1" {
  certificate_arn         = aws_acm_certificate.us_east_1.arn
  validation_record_fqdns = [for record in aws_route53_record.us_east_1_validation : record.fqdn]
  provider                = aws.us_east_1
} 