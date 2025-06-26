# Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.local` file with these required variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://chosn.dev/auth/github/callback

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key

# Email Configuration (Resend)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@chosn.dev

# Application URLs
NEXT_PUBLIC_APP_URL=https://chosn.dev
NEXTAUTH_URL=https://chosn.dev
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Optional Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Database Setup

1. **Run all migrations in order**:
   ```bash
   npx supabase db push
   ```

2. **Verify tables exist**:
   - profiles
   - developer_profiles
   - company_profiles
   - skills
   - user_skills
   - matches
   - conversations
   - messages
   - developer_activities
   - profile_views
   - social_card_shares

3. **Seed initial data** (optional):
   ```sql
   -- Add common skills
   INSERT INTO skills (name, category) VALUES
   ('JavaScript', 'Language'),
   ('TypeScript', 'Language'),
   ('React', 'Framework'),
   ('Node.js', 'Runtime'),
   ('Python', 'Language'),
   ('AWS', 'Cloud'),
   ('Docker', 'DevOps');
   ```

### 3. Third-Party Services Configuration

#### Supabase
- [ ] Enable Email Auth
- [ ] Configure OAuth providers
- [ ] Set up custom SMTP (optional)
- [ ] Configure Storage buckets for avatars

#### GitHub OAuth App
- [ ] Create OAuth App at github.com/settings/developers
- [ ] Set Authorization callback URL: `https://chosn.dev/auth/github/callback`
- [ ] Add homepage URL: `https://chosn.dev`

#### Stripe
- [ ] Create products:
  - Professional Plan ($49/month)
  - Enterprise Plan ($99/month)
- [ ] Set up webhook endpoint: `https://chosn.dev/api/stripe/webhook`
- [ ] Configure webhook events:
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_succeeded
  - invoice.payment_failed

#### Resend
- [ ] Verify domain or use test domain
- [ ] Create API key with send permissions
- [ ] Test email delivery

### 4. Build Optimization

1. **Update next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      'github.com',
      'avatars.githubusercontent.com',
      'your-supabase-project.supabase.co'
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
```

2. **Build and test locally**:
```bash
npm run build
npm run start
```

### 5. Deployment Options

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# ... add all other env vars
```

#### Option B: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway up
```

#### Option C: Docker
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### 6. Post-Deployment Tasks

#### Domain Configuration
- [ ] Point domain to deployment
- [ ] Configure SSL certificate
- [ ] Set up www redirect

#### Monitoring Setup
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog/GA)
- [ ] Uptime monitoring
- [ ] Set up alerts

#### Security Hardening
- [ ] Enable rate limiting
- [ ] Configure CORS
- [ ] Set security headers
- [ ] Review RLS policies

### 7. Testing Production

#### Critical User Flows
- [ ] Developer signup with GitHub
- [ ] Company signup and subscription
- [ ] Profile creation and editing
- [ ] GitHub skill validation
- [ ] Messaging between users
- [ ] Payment processing
- [ ] Email notifications
- [ ] Social card generation
- [ ] Activity feed updates

#### Performance Testing
```bash
# Test with Lighthouse
npm run build
npm run start
# Open Chrome DevTools > Lighthouse

# Load testing with k6
k6 run load-test.js
```

### 8. Launch Checklist

#### Day Before Launch
- [ ] Final database backup
- [ ] Test all critical paths
- [ ] Prepare status page
- [ ] Alert team members

#### Launch Day
- [ ] Deploy to production
- [ ] Verify all services connected
- [ ] Monitor error logs
- [ ] Check email delivery
- [ ] Test payment flow
- [ ] Announce on social media

#### Post-Launch
- [ ] Monitor user signups
- [ ] Check for errors
- [ ] Gather early feedback
- [ ] Fix critical issues
- [ ] Plan first iteration

## 🎯 Success Metrics

Monitor these KPIs after launch:

1. **User Acquisition**
   - Signups per day
   - Developer vs Company ratio
   - GitHub connection rate

2. **Engagement**
   - Daily active users
   - Messages sent
   - Profile completion rate
   - Social card shares

3. **Revenue**
   - Trial to paid conversion
   - MRR growth
   - Churn rate

4. **Technical**
   - Page load times
   - Error rates
   - API response times

## 🚨 Rollback Plan

If critical issues arise:

1. **Immediate Actions**
   ```bash
   # Revert to previous version
   vercel rollback
   
   # Or manually deploy previous commit
   git checkout <previous-stable-commit>
   vercel --prod
   ```

2. **Database Rollback**
   ```sql
   -- Keep migration rollback scripts ready
   -- Example: DROP TABLE IF EXISTS developer_activities CASCADE;
   ```

3. **Communication**
   - Update status page
   - Notify users via email/social
   - Document issues for post-mortem

## 🎉 You're Ready to Launch!

Your platform is production-ready. Follow this guide step-by-step for a smooth deployment. Good luck with your launch! 🚀 