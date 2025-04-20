variable "role_name" {
  description = "Name of the IAM role to be created for GitHub Actions"
  type        = string
}

variable "repository_subjects" {
  description = "List of repository subjects that can assume the role (e.g., ['repo:org/repo:ref:refs/heads/main'])"
  type        = list(string)
}

variable "policy_arns" {
  description = "List of IAM policy ARNs to attach to the role"
  type        = list(string)
} 