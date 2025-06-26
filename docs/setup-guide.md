# Chosn Platform Setup Guide 🚀

## **Authentication Fixes Complete ✅**

The authentication system has been updated to use real Supabase auth instead of mock data. Here's how to get everything working:

---

## 🔧 **1. Supabase Project Setup**

### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/login
3. Click "New Project"
4. Choose your organization (or create one)
5. Set project name: `chosn-platform`
6. Set database password (save this!)
7. Choose region closest to your users
8. Click "Create new project"

### **Step 2: Get Project Credentials**
1. Go to Project Settings → API
2. Copy these values for your environment variables:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service role key** (SUPABASE_SERVICE_ROLE_KEY) - keep this secret!

---

## 📝 **2. Environment Variables Setup**

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration (Required immediately)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Configuration (Already configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# GitHub OAuth (For Phase 2 - GitHub integration)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service (For Phase 3 - notifications)
RESEND_API_KEY=re_...

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**⚠️ Important**: Never commit `.env.local` to git. Add it to `.gitignore` if not already there.

---

## 🗄️ **3. Database Schema Setup**

### **Step 1: Run the Migration**
In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire content from `supabase/migrations/20250619085125_teal_desert.sql`
4. Paste it in the SQL editor
5. Click **"Run"**

This will create all the necessary tables:
- `profiles` (user accounts)
- `developer_profiles` (developer-specific data)
- `company_profiles` (company-specific data)
- `skills` (master skills list)
- `user_skills` (user-skill relationships)
- `projects` (developer portfolios)
- `matches` (job matches)
- `match_responses` (developer responses)
- `analytics_events` (user activity tracking)

### **Step 2: Verify Tables Created**
1. Go to **Table Editor** in Supabase dashboard
2. You should see all the tables listed
3. Check that the `skills` table has sample data

---

## 🔐 **4. Authentication Setup**

### **Step 1: Configure Auth Settings**
In your Supabase project:

1. Go to **Authentication** → **Settings**
2. Under **"Site URL"**, add: `http://localhost:3000`
3. Under **"Redirect URLs"**, add: `http://localhost:3000/auth/callback`
4. Save settings

### **Step 2: Test Registration**
The auth system now supports:
- ✅ Email/password signup for developers and companies
- ✅ Automatic profile creation in database
- ✅ Session management and refresh
- ✅ Real-time auth state changes

---

## 🧪 **5. Testing the Fixes**

### **Start the Development Server**
```bash
npm run dev
```

### **Test Authentication Flow**
1. **Visit** http://localhost:3000
2. **Click** "Join as Developer" or "Hire Talent"
3. **Fill out** signup form
4. **Check** that:
   - No more `onAuthStateChange` errors
   - No more Redux-persist warnings
   - User can register and login
   - Profile data is saved to Supabase

### **Verify Database**
1. Go to Supabase **Table Editor**
2. Check `profiles` table has new user
3. Check `developer_profiles` or `company_profiles` table has user data

---

## 🚨 **Common Issues & Solutions**

### **Issue: "Invalid API key"**
- **Solution**: Double-check your Supabase environment variables
- Make sure you copied the correct Project URL and keys

### **Issue: "Row Level Security policy violation"**
- **Solution**: The migration includes RLS policies
- If you see this error, re-run the migration SQL

### **Issue: "Failed to fetch"**
- **Solution**: Check that Supabase project is running
- Verify Site URL is set correctly in Supabase Auth settings

### **Issue: Still seeing Redux-persist warning**
- **Solution**: Restart your development server
- The SSR storage fix should eliminate the warning

---

## ✅ **Success Checklist**

- [ ] Supabase project created and configured
- [ ] Environment variables set in `.env.local`
- [ ] Database migration executed successfully
- [ ] Auth settings configured (Site URL, Redirect URLs)
- [ ] App starts without errors (`npm run dev`)
- [ ] Can register new users
- [ ] User data appears in Supabase tables
- [ ] No runtime errors in console

---

## 🚀 **Next Steps**

Once authentication is working:

1. **Test thoroughly** with both developer and company accounts
2. **Plan GitHub integration** (Phase 2)
3. **Design company dashboard** for discovering developers
4. **Build basic matching algorithm**

---

## 📞 **Need Help?**

If you encounter issues:

1. **Check browser console** for error messages
2. **Check Supabase logs** in project dashboard
3. **Verify environment variables** are loaded correctly
4. **Test Supabase connection** in SQL Editor

**The authentication foundation is now solid and ready for real users!** 🎉 