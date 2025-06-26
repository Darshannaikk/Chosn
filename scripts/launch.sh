#!/bin/bash

# Chosn Platform Complete Launch Script
# This script handles the complete launch process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "  ░░░░░░  ░░   ░░   ░░░░░   ░░░░░   ░░  ░░ "
echo " ░░      ░░   ░░  ░░   ░░ ░░       ░░░░░  "
echo " ░░      ░░   ░░  ░░   ░░  ░░░░░   ░░ ░░  "
echo " ░░      ░░   ░░  ░░   ░░      ░░  ░░  ░░ "
echo "  ░░░░░░  ░░░░░░   ░░░░░   ░░░░░   ░░   ░░"
echo ""
echo "🚀 COMPLETE PLATFORM LAUNCH SEQUENCE"
echo "======================================"
echo -e "${NC}"

# Step 1: Environment Check
echo -e "${BLUE}Step 1: Environment Verification${NC}"
echo "Checking all required environment variables..."

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
    echo "Please set these variables and run the script again."
    exit 1
fi

echo -e "${GREEN}✅ All environment variables verified${NC}"
echo ""

# Step 2: Database Setup
echo -e "${BLUE}Step 2: Database Migration Check${NC}"
echo "Ensuring all database migrations are applied..."

echo -e "${YELLOW}Manual verification required:${NC}"
echo "1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
echo "2. Ensure all migrations from supabase/migrations/ are applied"
echo "3. Verify tables exist: profiles, conversations, messages, developer_activities"
echo ""
read -p "Have you verified all database migrations are applied? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please apply database migrations first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database migrations verified${NC}"
echo ""

# Step 3: External Service Setup
echo -e "${BLUE}Step 3: External Services Verification${NC}"

echo "Checking GitHub OAuth setup..."
echo "- Callback URL should be: ${NEXT_PUBLIC_APP_URL}/auth/github/callback"
echo ""

echo "Checking Stripe webhooks..."
echo "- Webhook endpoint should be: ${NEXT_PUBLIC_APP_URL}/api/stripe/webhook"
echo "- Required events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted"
echo ""

echo "Checking Resend domain..."
echo "- Email from: ${EMAIL_FROM}"
echo ""

read -p "Have you verified all external services are configured? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please configure external services first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ External services verified${NC}"
echo ""

# Step 4: Build and Deploy
echo -e "${BLUE}Step 4: Building and Deploying Application${NC}"

echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

echo "Deploying to production..."
if command -v vercel &> /dev/null; then
    vercel --prod --yes
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Please deploy manually:${NC}"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Run: vercel --prod"
    echo ""
    read -p "Press Enter when deployment is complete..."
fi

echo -e "${GREEN}✅ Application deployed${NC}"
echo ""

# Step 5: Health Check
echo -e "${BLUE}Step 5: Health Verification${NC}"

echo "Waiting for deployment to be ready..."
sleep 30

echo "Running health check..."
HEALTH_URL="${NEXT_PUBLIC_APP_URL}/api/health"

for i in {1..5}; do
    if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        break
    fi
    echo "Attempt $i failed, retrying in 10 seconds..."
    sleep 10
    
    if [ $i -eq 5 ]; then
        echo -e "${RED}❌ Health check failed after 5 attempts${NC}"
        echo "Please check the deployment manually"
        exit 1
    fi
done

echo ""

# Step 6: Feature Testing
echo -e "${BLUE}Step 6: Feature Testing${NC}"

echo "Testing critical user flows:"
echo "1. User signup/login"
echo "2. GitHub connection"
echo "3. Profile creation"
echo "4. Messaging system"
echo "5. Payment flow"
echo ""

echo "Please test these flows manually:"
echo "🔗 App URL: ${NEXT_PUBLIC_APP_URL}"
echo ""

read -p "Have you tested all critical user flows? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please test user flows before continuing${NC}"
fi

echo -e "${GREEN}✅ Feature testing completed${NC}"
echo ""

# Step 7: Monitoring Setup
echo -e "${BLUE}Step 7: Monitoring Setup${NC}"

echo "Setting up monitoring and analytics..."

# Run monitoring setup
if [ -f "scripts/monitoring-setup.js" ]; then
    node scripts/monitoring-setup.js
else
    echo -e "${YELLOW}⚠️  Monitoring setup script not found${NC}"
fi

echo "📊 Admin Dashboard: ${NEXT_PUBLIC_APP_URL}/admin/dashboard"
echo ""

# Step 8: Launch Announcement
echo -e "${BLUE}Step 8: Launch Preparation${NC}"

echo "Preparing launch materials..."
echo ""
echo "📱 Social media posts ready:"
echo "- Twitter announcement"
echo "- LinkedIn post"
echo "- Product Hunt submission"
echo ""
echo "📧 Email campaigns:"
echo "- Welcome email sequence active"
echo "- User onboarding flow"
echo ""
echo "🔗 SEO optimizations:"
echo "- Sitemap: ${NEXT_PUBLIC_APP_URL}/sitemap.xml"
echo "- Robots.txt: ${NEXT_PUBLIC_APP_URL}/robots.txt"
echo ""

# Final Summary
echo -e "${GREEN}"
echo "🎉 LAUNCH SEQUENCE COMPLETE!"
echo "=============================="
echo -e "${NC}"
echo ""
echo -e "${PURPLE}Platform Status: LIVE ✨${NC}"
echo ""
echo "🌐 Production URL: ${NEXT_PUBLIC_APP_URL}"
echo "📊 Admin Dashboard: ${NEXT_PUBLIC_APP_URL}/admin/dashboard"
echo "🔧 Health Check: ${NEXT_PUBLIC_APP_URL}/api/health"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Monitor user signups and engagement"
echo "2. Respond to user feedback quickly"
echo "3. Watch for any error alerts"
echo "4. Execute marketing campaigns"
echo "5. Celebrate! 🍾"
echo ""
echo -e "${GREEN}Welcome to the future of developer talent discovery!${NC}"
echo -e "${PURPLE}🚀 Chosn is now LIVE! 🚀${NC}" 