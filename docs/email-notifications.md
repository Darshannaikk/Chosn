# Email Notification System

## Overview
Chosn uses Resend for transactional emails with beautiful React Email templates. The system sends notifications for key user events while respecting user preferences.

## Email Types

### 1. New Message Notification
- **Trigger**: When a user receives a new message
- **Content**: Sender name, message preview, link to conversation
- **Frequency**: Real-time

### 2. Match Interest Notification
- **Trigger**: When someone shows interest in a profile
- **Content**: Interested party's name, profile link
- **Frequency**: Real-time

### 3. Welcome Email
- **Trigger**: New user registration
- **Content**: Personalized onboarding steps based on user type
- **Frequency**: Once per user

### 4. Subscription Emails
- **Trigger**: Subscription events (created, updated, cancelled, expired)
- **Content**: Plan details, billing information, action links
- **Frequency**: As events occur

### 5. Weekly Digest (Future)
- **Trigger**: Weekly cron job
- **Content**: Activity summary, new matches, unread messages
- **Frequency**: Weekly (if enabled)

## Technical Implementation

### Email Service (`lib/services/email.ts`)
- Centralized email sending logic
- Template rendering with React Email
- Error handling and logging

### Email Templates (`emails/`)
- React components for each email type
- Consistent styling and branding
- Mobile-responsive design

### Database Schema
- `email_notifications` JSONB column in profiles
- `email_logs` table for tracking sent emails
- `user_wants_email_notification()` function

## Configuration

### Environment Variables
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@chosn.dev
NEXT_PUBLIC_APP_URL=https://chosn.dev
```

### User Preferences
Users can control notifications in their settings:
```json
{
  "new_messages": true,
  "match_interest": true,
  "weekly_digest": true,
  "platform_updates": true
}
```

## Integration Points

### 1. Messaging System
```typescript
// Automatically sends email when message is sent
await messagingService.sendMessage(conversationId, content);
```

### 2. Match Interest
```typescript
// Send email when showing interest
await emailService.sendMatchInterestNotification({
  recipientEmail: developer.email,
  recipientName: developer.name,
  interestedUserName: company.name,
  interestedUserType: 'company',
  profileUrl: `${APP_URL}/profile/${company.id}`
});
```

### 3. Authentication
```typescript
// Send welcome email after signup
await emailService.sendWelcomeEmail({
  email: user.email,
  name: user.name,
  userType: user.user_type
});
```

## Email Design Principles

### Visual Hierarchy
- Clear subject lines
- Prominent CTAs
- Scannable content

### Branding
- Consistent color scheme (#5469d4)
- Logo in header
- Professional typography

### Accessibility
- Alt text for images
- Sufficient color contrast
- Clear link text

## Testing Emails

### Local Development
1. Set up Resend API key
2. Use test email addresses
3. Check email logs in database

### Preview Templates
```bash
npm run email:preview
```

### Test Sending
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new-message",
    "data": {
      "recipientEmail": "test@example.com",
      "recipientName": "Test User",
      "senderName": "John Doe",
      "messagePreview": "Hey, are you available for a project?",
      "conversationUrl": "http://localhost:3000/messages?conversation=123"
    }
  }'
```

## Monitoring & Analytics

### Email Logs
- Track all sent emails
- Monitor delivery rates
- Debug failed sends

### Metrics to Track
- Open rates (via Resend dashboard)
- Click-through rates
- Unsubscribe rates
- Bounce rates

## Best Practices

### Sending Strategy
1. Check user preferences before sending
2. Batch similar notifications
3. Respect time zones for digests
4. Handle failures gracefully

### Content Guidelines
1. Keep subject lines under 50 characters
2. Preview text should summarize the email
3. One clear CTA per email
4. Include unsubscribe link

### Performance
1. Send emails asynchronously
2. Use queues for bulk sending
3. Cache user preferences
4. Log but don't block on failures

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check Resend API key
   - Verify email addresses
   - Check email logs table

2. **Emails going to spam**
   - Verify domain authentication
   - Check content for spam triggers
   - Monitor sender reputation

3. **Template rendering errors**
   - Validate React Email components
   - Check for missing props
   - Test with email:preview

## Future Enhancements

### V1.5
- [ ] Email verification flow
- [ ] Unsubscribe management page
- [ ] A/B testing for subject lines
- [ ] Rich email analytics

### V2.0
- [ ] Internationalization
- [ ] Dynamic content based on user behavior
- [ ] Triggered email campaigns
- [ ] SMS notifications option 