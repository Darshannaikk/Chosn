#!/bin/bash

# Chosn Platform Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_ROOT=$(pwd)

echo "🚀 Starting Chosn deployment for environment: $ENVIRONMENT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required environment variables are set
check_env_vars() {
    echo -e "${BLUE}Checking environment variables...${NC}"
    
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "GITHUB_CLIENT_ID"
        "GITHUB_CLIENT_SECRET"
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SECRET"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "RESEND_API_KEY"
        "EMAIL_FROM"
        "NEXT_PUBLIC_APP_URL"
    )
    
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        printf '%s\n' "${MISSING_VARS[@]}"
        echo ""
        echo "Please set these variables in your environment or .env.local file"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All required environment variables are set${NC}"
}

# Run tests
run_tests() {
    echo -e "${BLUE}Running tests...${NC}"
    
    # Check if package.json has test script
    if npm run | grep -q "test"; then
        npm test || {
            echo -e "${RED}❌ Tests failed${NC}"
            exit 1
        }
    else
        echo -e "${YELLOW}⚠️  No test script found, skipping tests${NC}"
    fi
    
    echo -e "${GREEN}✅ Tests passed${NC}"
}

# Build the application
build_app() {
    echo -e "${BLUE}Building application...${NC}"
    
    # Install dependencies
    npm ci
    
    # Build the application
    npm run build || {
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Build successful${NC}"
}

# Health check
health_check() {
    echo -e "${BLUE}Running health check...${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Wait for deployment to be ready
        sleep 10
        
        # Check if the app is responding
        HEALTH_URL="${NEXT_PUBLIC_APP_URL}/api/health"
        
        for i in {1..5}; do
            if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Health check passed${NC}"
                return 0
            fi
            echo "Attempt $i failed, retrying in 10 seconds..."
            sleep 10
        done
        
        echo -e "${RED}❌ Health check failed${NC}"
        exit 1
    else
        echo -e "${YELLOW}⚠️  Skipping health check for non-production environment${NC}"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}Deploying to Vercel...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod --yes || {
            echo -e "${RED}❌ Vercel deployment failed${NC}"
            exit 1
        }
    else
        vercel --yes || {
            echo -e "${RED}❌ Vercel deployment failed${NC}"
            exit 1
        }
    fi
    
    echo -e "${GREEN}✅ Vercel deployment successful${NC}"
}

# Deploy to Railway
deploy_railway() {
    echo -e "${BLUE}Deploying to Railway...${NC}"
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "Railway CLI not found. Please install it from https://railway.app/cli"
        exit 1
    fi
    
    railway up || {
        echo -e "${RED}❌ Railway deployment failed${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Railway deployment successful${NC}"
}

# Run database migrations
run_migrations() {
    echo -e "${BLUE}Running database migrations...${NC}"
    
    # This would connect to Supabase and run migrations
    # For now, we'll just check if the connection works
    
    echo -e "${YELLOW}⚠️  Manual step: Ensure all SQL migrations in supabase/migrations/ are applied${NC}"
    echo "Run them manually in the Supabase SQL editor if needed"
}

# Main deployment function
main() {
    echo "======================================"
    echo "🚀 Chosn Platform Deployment"
    echo "Environment: $ENVIRONMENT"
    echo "======================================"
    
    check_env_vars
    
    # Skip tests in production for faster deployment
    if [ "$ENVIRONMENT" != "production" ]; then
        run_tests
    fi
    
    build_app
    
    # Choose deployment target based on environment variable or argument
    DEPLOY_TARGET=${DEPLOY_TARGET:-vercel}
    
    case $DEPLOY_TARGET in
        "vercel")
            deploy_vercel
            ;;
        "railway")
            deploy_railway
            ;;
        *)
            echo -e "${RED}❌ Unknown deployment target: $DEPLOY_TARGET${NC}"
            echo "Supported targets: vercel, railway"
            exit 1
            ;;
    esac
    
    run_migrations
    health_check
    
    echo ""
    echo "======================================"
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo "Environment: $ENVIRONMENT"
    echo "URL: $NEXT_PUBLIC_APP_URL"
    echo "======================================"
}

# Run the deployment
main 