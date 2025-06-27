-- Add email notification preferences to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications JSONB DEFAULT '{
  "new_messages": true,
  "match_interest": true,
  "weekly_digest": true,
  "platform_updates": true
}'::jsonb;

-- Create an index for email preferences
CREATE INDEX IF NOT EXISTS idx_profiles_email_notifications ON profiles USING GIN (email_notifications);

-- Add email_verified column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE;

-- Function to check if user wants a specific email notification
CREATE OR REPLACE FUNCTION user_wants_email_notification(user_id UUID, notification_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  preferences JSONB;
BEGIN
  SELECT email_notifications INTO preferences
  FROM profiles
  WHERE id = user_id;
  
  IF preferences IS NULL THEN
    RETURN TRUE; -- Default to true if not set
  END IF;
  
  RETURN COALESCE((preferences->notification_type)::boolean, TRUE);
END;
$$ LANGUAGE plpgsql;

-- Create email log table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  error_message TEXT,
  metadata JSONB
);

-- Index for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type); 