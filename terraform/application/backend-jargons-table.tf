module "jargons_table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "4.3.0"

  name     = "jargons"
  hash_key = "id"

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "domain"
      type = "S"
    }
  ]

  global_secondary_indexes = [
    {
      name            = "DomainIndex"
      hash_key        = "domain"
      projection_type = "ALL"
      write_capacity  = null
      read_capacity   = null
    }
  ]

  billing_mode = "PAY_PER_REQUEST"
}
