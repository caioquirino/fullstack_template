module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "5.12.0"

  cluster_name = local.project_prefix

  # Use Fargate capacity providers
  default_capacity_provider_use_fargate = true

  # Configure Fargate capacity providers
  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        base              = 1
        weight            = 100
        capacity_provider = "FARGATE"
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        base              = 0
        weight            = 100
        capacity_provider = "FARGATE_SPOT"
      }
    }
  }

  # Enable container insights
  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/aws/ecs/${local.project_prefix}"
      }
    }
  }
}