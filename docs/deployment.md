# Deployment Guide

## Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Environment Variables**
   ```bash
   # Add all environment variables from env.example
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   RESEND_API_KEY=
   STRIPE_PUBLIC_KEY=
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   ```bash
   npm run build
   # Auto-deploys on git push
   ```

## Docker Deployment

1. **Build Image**
   ```bash
   docker build -t chosn-platform .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env chosn-platform
   ```

## Railway Deployment

1. **Connect Repository**
   - Import project to Railway
   - Configure railway.toml

2. **Environment Variables**
   - Add all required environment variables
   - Set RAILWAY_STATIC_URL

3. **Deploy**
   ```bash
   railway up
   ```

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Supabase RLS policies enabled
- [ ] Stripe webhooks configured
- [ ] GitHub OAuth app configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Analytics configured

## Post-Deployment

1. **Test Core Flows**
   - User registration/login
   - GitHub connection
   - Profile creation
   - Matching functionality
   - Payment processing

2. **Monitor**
   - Check Vercel dashboard
   - Monitor Supabase usage
   - Check error logs

## Rollback

```bash
# Vercel
vercel rollback

# Railway  
railway rollback

# Docker
docker run previous-image-tag
``` 