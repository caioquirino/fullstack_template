#!/bin/bash

# Default to 'test' environment if not specified
ENVIRONMENT=${1:-dev}
PROJECT_NAME=${PROJECT_NAME:-fullstack-template}

check_requirements() {
    command -v aws &> /dev/null || { echo "AWS CLI is not installed"; exit 1; }
    aws sts get-caller-identity &> /dev/null || { echo "AWS credentials are not configured"; exit 1; }
}

get_ssm_param() {
    aws ssm get-parameter --name "/${PROJECT_NAME}/$ENVIRONMENT/$1" --with-decryption --query "Parameter.Value" --output text
}

check_ssm_params() {
    local missing_params=()
    local required_params=(
        "stytch-project-id"
        "stytch-secret-key"
        "stytch-public-token"
        "graphql-url"
    )

    for param in "${required_params[@]}"; do
        if ! aws ssm get-parameter --name "/${PROJECT_NAME}/$ENVIRONMENT/$param" &> /dev/null; then
            missing_params+=("$param")
        fi
    done

    if [ ${#missing_params[@]} -ne 0 ]; then
        echo "Error: The following parameters are missing in SSM:"
        printf '%s\n' "${missing_params[@]}"
        exit 1
    fi
}

check_requirements
check_ssm_params
echo "Generating .env file for $ENVIRONMENT environment..."

# Generate .env file
cat > .env << EOL
# Environment
NEXT_PUBLIC_STYTCH_PROJECT_ENV=$ENVIRONMENT

# Stytch Configuration
NEXT_PUBLIC_STYTCH_PROJECT_ID=$(get_ssm_param "stytch-project-id")
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=$(get_ssm_param "stytch-public-token")
STYTCH_SECRET_KEY=$(get_ssm_param "stytch-secret-key")

# GraphQL Configuration
NEXT_PUBLIC_GRAPHQL_URL=$(get_ssm_param "graphql-url")
EOL

echo ".env file generated successfully!" 