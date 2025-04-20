output "hosted_zones" {
  description = "Map of hosted zone information"
  value = {
    arn          = aws_route53_zone.this.arn
    fqdn         = var.domain_name
    name         = aws_route53_zone.this.name
    name_servers = aws_route53_zone.this.name_servers
  }
}

output "certificates" {
  description = "Map of certificate information for each region"
  value = {
    eu_central_1 = {
      fqdn = var.domain_name
      arn  = aws_acm_certificate.eu_central_1.arn
      name = aws_acm_certificate.eu_central_1.domain_name
    }
    us_east_1 = {
      fqdn = var.domain_name
      arn  = aws_acm_certificate.us_east_1.arn
      name = aws_acm_certificate.us_east_1.domain_name
    }
  }
}