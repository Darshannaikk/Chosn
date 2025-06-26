# Email Notifications Setup Guide

## Prerequisites
- [ ] Resend account (sign up at https://resend.com)
- [ ] Verified domain or use Resend's test domain

## Step 1: Get Your Resend API Key

1. Go to https://resend.com/api-keys
2. Create a new API key with "Send emails" permission
3. Copy the API key

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Or use Resend's test domain during development
EMAIL_FROM=onboarding@resend.dev
```

## Step 3: Domain Configuration (Production)

For production, you'll need to:
1. Add and verify your domain in Resend
2. Update DNS records as instructed by Resend
3. Update `EMAIL_FROM` to use your verified domain

## Email Types Implemented

The platform sends these email notifications:

### 1. Welcome Email
- Triggered when a new user signs up
- Different templates for developers vs companies

### 2. New Message Notification  
- Sent when a user receives a new message
- Includes message preview and link to conversation

### 3. Match Interest Notification
- Sent when someone shows interest in a profile
- Includes interested party's name and profile link

### 4. Subscription Emails
- Sent for subscription events (created, updated, cancelled)
- Includes plan details and management links

## Testing Email Locally

1. Use Resend's test API key during development
2. Test endpoint: `POST /api/email/send`
3. Example request:

```json
{
  "type": "welcome",
  "data": {
    "email": "test@example.com",
    "name": "Test User",
    "userType": "developer"
  }
}
```

## Email Preferences

Users can manage their email preferences in Settings:
- New message notifications
- Match interest notifications  
- Weekly digest emails
- Platform updates

## Troubleshooting

1. **"Invalid API key"**: Check your RESEND_API_KEY in .env.local
2. **"From address not verified"**: Use onboarding@resend.dev for testing
3. **Emails not sending**: Check Resend dashboard for logs

## Next Steps

After email setup is complete:
1. Test all email types
2. Implement email preference checks
3. Set up weekly digest cron job
4. Monitor email delivery rates 