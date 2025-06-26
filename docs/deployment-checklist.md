# Chosn V1 Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables
Ensure all required environment variables are set in production:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx

# GitHub OAuth
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret

# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@chosn.dev

# App
NEXT_PUBLIC_APP_URL=https://chosn.dev
```

### 2. Database Migrations
Run all migrations in order:

```bash
# Initial schema
supabase migration up 20250619085125_teal_desert.sql

# Messaging system
supabase migration up 20250120_messaging_system.sql

# Email preferences
supabase migration up 20250120_email_preferences.sql
```

### 3. Supabase Configuration

#### Authentication
- [ ] Enable Email/Password authentication
- [ ] Configure GitHub OAuth provider with production credentials
- [ ] Set up email templates for auth emails
- [ ] Configure redirect URLs for production domain

#### Realtime
- [ ] Enable Realtime for messages table
- [ ] Enable Realtime for conversations table
- [ ] Configure connection limits based on expected load

#### Storage
- [ ] Create avatars bucket with public access
- [ ] Set up image transformation policies
- [ ] Configure CDN for static assets

### 4. Stripe Setup

#### Products & Pricing
- [ ] Create Professional plan ($99/month)
- [ ] Create Enterprise plan ($299/month)
- [ ] Set up trial periods if desired
- [ ] Configure tax settings

#### Webhooks
- [ ] Add production webhook endpoint: `https://chosn.dev/api/stripe/webhook`
- [ ] Select events to listen for:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

#### Portal
- [ ] Configure customer portal settings
- [ ] Enable subscription management
- [ ] Set up cancellation flow

### 5. GitHub App Setup
- [ ] Register production OAuth app
- [ ] Set callback URL: `https://chosn.dev/auth/github/callback`
- [ ] Request necessary scopes: `read:user`, `user:email`, `repo`
- [ ] Add app logo and description

### 6. Email Configuration (Resend)
- [ ] Verify domain ownership
- [ ] Set up SPF, DKIM, and DMARC records
- [ ] Configure from address
- [ ] Test email deliverability

## Deployment Steps

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### 2. Post-Deployment Configuration
- [ ] Set all environment variables in Vercel dashboard
- [ ] Configure custom domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up monitoring and alerts

### 3. Database Indexes
Verify all indexes are created:
```sql
-- Check indexes
SELECT tablename, indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

### 4. Security Checklist
- [ ] Enable Row Level Security on all tables
- [ ] Verify RLS policies are correct
- [ ] Test authentication flows
- [ ] Verify CORS settings
- [ ] Enable rate limiting

## Testing Checklist

### 1. Authentication Flow
- [ ] Sign up as developer
- [ ] Sign up as company
- [ ] GitHub OAuth connection
- [ ] Password reset flow
- [ ] Session persistence

### 2. Developer Features
- [ ] Profile creation
- [ ] GitHub skill validation
- [ ] Profile visibility
- [ ] Receiving messages
- [ ] Email notifications

### 3. Company Features
- [ ] Subscription purchase
- [ ] Developer search
- [ ] Messaging developers
- [ ] Subscription management
- [ ] Billing portal access

### 4. Payment Flow
- [ ] Checkout process
- [ ] Webhook processing
- [ ] Subscription activation
- [ ] Cancellation flow
- [ ] Invoice emails

### 5. Messaging System
- [ ] Send/receive messages
- [ ] Real-time updates
- [ ] Unread counts
- [ ] Email notifications
- [ ] Message history

### 6. Performance Testing
- [ ] Page load times < 3s
- [ ] Search response < 1s
- [ ] WebSocket stability
- [ ] Database query performance
- [ ] CDN asset delivery

## Monitoring Setup

### 1. Application Monitoring
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure performance alerts

### 2. Business Metrics
- [ ] User sign-up tracking
- [ ] Subscription conversion rate
- [ ] Message engagement rate
- [ ] GitHub connection rate
- [ ] Payment success rate

### 3. Technical Metrics
- [ ] API response times
- [ ] Database connection pool
- [ ] WebSocket connections
- [ ] Email delivery rate
- [ ] Error rates by endpoint

## Launch Tasks

### 1. Marketing Site
- [ ] Update landing page copy
- [ ] Add testimonials
- [ ] Create demo video
- [ ] Set up analytics
- [ ] Add cookie banner

### 2. Legal
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] GDPR compliance
- [ ] Data processing agreements

### 3. Support
- [ ] Set up help documentation
- [ ] Create FAQ section
- [ ] Configure support email
- [ ] Set up feedback form
- [ ] Create onboarding emails

### 4. SEO
- [ ] Meta tags optimization
- [ ] Sitemap generation
- [ ] Robots.txt configuration
- [ ] Schema markup
- [ ] Social media cards

## Rollback Plan

### If Issues Occur:
1. **Database**: Keep backup before migration
2. **Code**: Use Vercel's instant rollback
3. **Stripe**: Pause new subscriptions
4. **Communications**: Have status page ready

### Emergency Contacts:
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io
- Stripe Support: Via dashboard
- Resend Support: support@resend.com

## Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Check conversion funnel
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries

### Month 1
- [ ] Analyze user behavior
- [ ] A/B test pricing
- [ ] Improve onboarding
- [ ] Add requested features
- [ ] Scale infrastructure

## Success Metrics

### Technical
- ✅ < 1% error rate
- ✅ < 3s page load time
- ✅ 99.9% uptime
- ✅ < 100ms API response time

### Business
- ✅ 100+ developer sign-ups
- ✅ 10+ company subscriptions
- ✅ 50+ GitHub connections
- ✅ 5% free-to-paid conversion

## Notes

- Always test in staging first
- Have rollback plan ready
- Monitor closely for first 48 hours
- Keep team on standby for quick fixes
- Celebrate the launch! 🎉 