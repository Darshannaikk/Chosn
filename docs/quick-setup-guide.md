# Quick Setup Guide - Fix Authentication Issues

## Problem
You're getting authentication errors because the Supabase environment variables are not configured.

## Solution

### Step 1: Create `.env.local` file
Create a file named `.env.local` in your project root with the following content:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (Can use test keys for now)
STRIPE_SECRET_KEY=sk_test_51234567890
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890
STRIPE_WEBHOOK_SECRET=whsec_test123
STRIPE_PROFESSIONAL_PRICE_ID=price_test123
STRIPE_ENTERPRISE_PRICE_ID=price_test456

# GitHub OAuth (Optional for now)
GITHUB_CLIENT_ID=optional_for_now
GITHUB_CLIENT_SECRET=optional_for_now

# Email Configuration (Optional for now)
RESEND_API_KEY=re_optional_for_now
EMAIL_FROM=noreply@localhost

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Get Supabase Credentials

1. **Create a Supabase Account** (if you haven't already):
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create a New Project**:
   - Click "New project"
   - Choose your organization
   - Name your project (e.g., "chosn")
   - Set a database password (save this!)
   - Select a region close to you
   - Click "Create new project"

3. **Get Your API Keys**:
   - Once project is created, go to Settings → API
   - Copy these values:
     - `Project URL` → paste as `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Run Database Migrations

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Supabase dashboard URL: `https://app.supabase.com/project/YOUR-PROJECT-REF`)

3. **Run migrations**:
   ```bash
   supabase db push
   ```

   Or manually run in Supabase SQL Editor:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste contents of:
     - `supabase/migrations/20250619085125_teal_desert.sql`
     - `supabase/migrations/20250120_messaging_system.sql`
     - `supabase/migrations/20250120_email_preferences.sql`
   - Run each migration

### Step 4: Enable Authentication

1. **In Supabase Dashboard**:
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email settings:
     - Enable "Confirm email" (optional for development)
     - Set up email templates

2. **Configure Auth Settings**:
   - Go to Authentication → URL Configuration
   - Set Site URL: `http://localhost:3000`
   - Add Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/github/callback`

### Step 5: Restart Your Application

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### Step 6: Test Authentication

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create a new account
4. Check your email for confirmation (if enabled)
5. Log in with your credentials

## Common Issues & Solutions

### Issue: "Invalid API key"
**Solution**: Double-check that you copied the correct keys from Supabase

### Issue: "Database connection failed"
**Solution**: Make sure you ran all migrations

### Issue: "Email not sending"
**Solution**: For development, you can disable email confirmation in Supabase

### Issue: "GitHub login not working"
**Solution**: GitHub OAuth is optional for basic auth. You can set it up later.

## Minimal Working Configuration

If you just want to test quickly, here's the absolute minimum:

1. Create `.env.local` with just Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

2. The other services (Stripe, GitHub, Email) will work in "demo mode" without breaking the app.

## Need More Help?

1. Check browser console for specific errors
2. Check terminal for server-side errors
3. Verify all environment variables are set correctly
4. Make sure Supabase project is active (not paused)

Once you complete these steps, authentication should work properly! 