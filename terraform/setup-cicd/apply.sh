#!/bin/bash
set -e

# Check if repository argument is provided
if [ -z "$1" ]; then
    echo "Error: Repository argument is required"
    echo "Usage: $0 <org/repository>"
    exit 1
fi

# Check if repository follows org/repository format
if [[ ! "$1" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
    echo "Error: Repository must be in the format 'org/repository'"
    echo "Example: myorg/myrepo" 
    exit 1
fi


REPOSITORY="${1}" 

# Configuration
REGION="eu-west-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --no-cli-pager)
BUCKET_NAME="${AWS_ACCOUNT_ID}-template-terraform-state"

# Create S3 bucket for Terraform state if it doesn't exist
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null --no-cli-pager; then
    echo "Creating S3 bucket for Terraform state..."
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION" \
        --no-cli-pager
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket "$BUCKET_NAME" \
        --versioning-configuration Status=Enabled \
        --no-cli-pager
    
    # Enable server-side encryption
    aws s3api put-bucket-encryption \
        --bucket "$BUCKET_NAME" \
        --server-side-encryption-configuration '{
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }
            ]
        }' \
        --no-cli-pager
fi

# Initialize Terraform with backend configuration
echo "Initializing Terraform..."
terraform init -backend-config="bucket=${BUCKET_NAME}"

# Create and store plan
echo "Creating Terraform plan..."
terraform plan -out=tfplan -var="repository=${REPOSITORY}"

echo "Applying Terraform plan..."
  terraform apply tfplan

# Clean up
rm -f tfplan 