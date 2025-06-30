#!/bin/bash
set -e

# Configuration
REGION="eu-west-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --no-cli-pager)
BUCKET_NAME="${AWS_ACCOUNT_ID}-template-terraform-state"

# Source .env file from git root if it exists and not in GitHub Actions
if [[ -z "${GITHUB_ACTIONS}" ]]; then
  ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null)"
  if [[ -f "${ROOT_DIR}/.env" ]]; then
    set -a
    source "${ROOT_DIR}/.env"
    set +a
  fi
fi




# Initialize Terraform with backend configuration
echo "Initializing Terraform..."
terraform init -backend-config="bucket=${BUCKET_NAME}"

# Create and store plan
echo "Creating Terraform plan..."
terraform plan \
  -var="stytch_project_id=${STYTCH_PROJECT_ID}" \
  -var="stytch_secret_key=${STYTCH_SECRET_KEY}" \
  -var="stytch_project_env=${STYTCH_PROJECT_ENV}" \
  -out=tfplan

echo "Applying Terraform plan..."
terraform apply tfplan

# Clean up
rm -f tfplan 