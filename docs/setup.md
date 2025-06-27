# Chosn Platform Setup Guide

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd chosn
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Fill in your environment variables
   ```

3. **Database Setup**
   - Create Supabase project
   - Run migrations in `supabase/migrations/`
   - Update database URL in `.env.local`

4. **Development**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Stripe
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
chosn/
├── app/                    # Pages & API routes
├── components/            # Reusable components  
├── lib/                  # Utilities & logic
├── docs/                 # Documentation
├── tests/               # All tests
└── public/             # Static assets
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run deploy` - Deploy to production 