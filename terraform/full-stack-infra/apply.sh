#!/bin/bash
set -e

# Configuration
REGION="eu-central-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --no-cli-pager)
BUCKET_NAME="${AWS_ACCOUNT_ID}-terraform-state"

# Initialize Terraform with backend configuration
echo "Initializing Terraform..."
terraform init -backend-config="bucket=${BUCKET_NAME}"

# Create and store plan
echo "Creating Terraform plan..."
terraform plan -out=tfplan

echo "Applying Terraform plan..."
terraform apply tfplan

# Clean up
rm -f tfplan 