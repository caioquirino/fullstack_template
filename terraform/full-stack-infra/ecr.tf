

module "ecr" {
  source = "../modules/ecr"

  repository_name      = local.project_prefix
  image_tag_mutability = "MUTABLE"
  scan_on_push         = true

  lifecycle_policy = {
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  }
}