-- Activity Tracking System for Developer Timeline and Company Feed

-- Developer Activities Table
CREATE TABLE IF NOT EXISTS developer_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
    'github_commit',
    'github_push', 
    'skill_added',
    'skill_validated',
    'profile_update',
    'achievement_earned',
    'availability_change',
    'profile_view_received',
    'message_received',
    'match_created'
  )),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_developer_activities_developer_id (developer_id),
  INDEX idx_developer_activities_type (activity_type),
  INDEX idx_developer_activities_created_at (created_at DESC),
  INDEX idx_developer_activities_public (is_public, created_at DESC)
);

-- Profile Views Tracking
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  viewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate views within same hour
  UNIQUE(viewer_id, viewed_id, DATE_TRUNC('hour', viewed_at)),
  
  -- Indexes
  INDEX idx_profile_views_viewed_id (viewed_id),
  INDEX idx_profile_views_viewer_id (viewer_id),
  INDEX idx_profile_views_viewed_at (viewed_at DESC)
);

-- Social Card Analytics
CREATE TABLE IF NOT EXISTS social_card_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) CHECK (platform IN ('twitter', 'linkedin', 'download', 'link_copy', 'other')),
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  referrer_url TEXT,
  
  -- Track conversions
  resulted_in_signup BOOLEAN DEFAULT false,
  signup_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_social_card_shares_developer_id (developer_id),
  INDEX idx_social_card_shares_shared_at (shared_at DESC)
);

-- Developer Timeline Settings
CREATE TABLE IF NOT EXISTS developer_timeline_settings (
  developer_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  show_github_activity BOOLEAN DEFAULT true,
  show_skill_updates BOOLEAN DEFAULT true,
  show_profile_views BOOLEAN DEFAULT true,
  show_messages BOOLEAN DEFAULT false,
  show_achievements BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GitHub Activity Cache (for performance)
CREATE TABLE IF NOT EXISTS github_activity_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  repo_name VARCHAR(255),
  commit_message TEXT,
  commit_sha VARCHAR(40),
  language VARCHAR(50),
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  activity_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(developer_id, commit_sha),
  
  -- Indexes
  INDEX idx_github_activity_developer_id (developer_id),
  INDEX idx_github_activity_date (activity_date DESC)
);

-- Row Level Security Policies

-- Developer Activities
ALTER TABLE developer_activities ENABLE ROW LEVEL SECURITY;

-- Developers can view their own activities
CREATE POLICY "Developers can view own activities" ON developer_activities
  FOR SELECT USING (auth.uid() = developer_id);

-- Public activities are visible to all authenticated users
CREATE POLICY "Public activities visible to authenticated users" ON developer_activities
  FOR SELECT USING (is_public = true AND auth.uid() IS NOT NULL);

-- Developers can insert their own activities
CREATE POLICY "Developers can create own activities" ON developer_activities
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

-- Profile Views
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Users can see who viewed their profile
CREATE POLICY "Users can see own profile views" ON profile_views
  FOR SELECT USING (auth.uid() = viewed_id);

-- Companies can see their viewing history
CREATE POLICY "Companies can see own viewing history" ON profile_views
  FOR SELECT USING (auth.uid() = viewer_id);

-- Any authenticated user can create a view
CREATE POLICY "Authenticated users can create views" ON profile_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- Social Card Shares
ALTER TABLE social_card_shares ENABLE ROW LEVEL SECURITY;

-- Developers can see their own share analytics
CREATE POLICY "Developers can view own share analytics" ON social_card_shares
  FOR SELECT USING (auth.uid() = developer_id);

-- Developers can track their shares
CREATE POLICY "Developers can track shares" ON social_card_shares
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

-- Timeline Settings
ALTER TABLE developer_timeline_settings ENABLE ROW LEVEL SECURITY;

-- Developers can manage their own timeline settings
CREATE POLICY "Developers can manage timeline settings" ON developer_timeline_settings
  FOR ALL USING (auth.uid() = developer_id);

-- GitHub Activity Cache
ALTER TABLE github_activity_cache ENABLE ROW LEVEL SECURITY;

-- Same policies as developer activities
CREATE POLICY "Developers can view own github cache" ON github_activity_cache
  FOR SELECT USING (auth.uid() = developer_id);

CREATE POLICY "Developers can insert github cache" ON github_activity_cache
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

-- Functions

-- Function to track profile view and create activity
CREATE OR REPLACE FUNCTION track_profile_view(viewed_user_id UUID)
RETURNS void AS $$
DECLARE
  viewer_company_name TEXT;
BEGIN
  -- Insert profile view
  INSERT INTO profile_views (viewer_id, viewed_id, viewer_company_id)
  SELECT 
    auth.uid(),
    viewed_user_id,
    cp.id
  FROM company_profiles cp
  WHERE cp.id = auth.uid()
  ON CONFLICT (viewer_id, viewed_id, DATE_TRUNC('hour', NOW())) 
  DO NOTHING;

  -- Get company name if viewer is a company
  SELECT company_name INTO viewer_company_name
  FROM company_profiles
  WHERE id = auth.uid();

  -- Create activity for the viewed developer
  IF viewer_company_name IS NOT NULL THEN
    INSERT INTO developer_activities (
      developer_id,
      activity_type,
      title,
      description,
      metadata
    ) VALUES (
      viewed_user_id,
      'profile_view_received',
      'Profile viewed',
      viewer_company_name || ' viewed your profile',
      jsonb_build_object('company_name', viewer_company_name, 'viewer_id', auth.uid())
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create activity when skill is added
CREATE OR REPLACE FUNCTION create_skill_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO developer_activities (
    developer_id,
    activity_type,
    title,
    description,
    metadata
  ) VALUES (
    NEW.user_id,
    CASE 
      WHEN NEW.validated_via_github THEN 'skill_validated'
      ELSE 'skill_added'
    END,
    'New skill added',
    'Added ' || (SELECT name FROM skills WHERE id = NEW.skill_id) || 
    CASE 
      WHEN NEW.validated_via_github THEN ' (GitHub validated - ' || NEW.proficiency_level || '% confidence)'
      ELSE ''
    END,
    jsonb_build_object(
      'skill_id', NEW.skill_id,
      'skill_name', (SELECT name FROM skills WHERE id = NEW.skill_id),
      'validated', NEW.validated_via_github,
      'confidence', NEW.proficiency_level
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for skill activities
CREATE TRIGGER on_skill_added
  AFTER INSERT ON user_skills
  FOR EACH ROW
  EXECUTE FUNCTION create_skill_activity();

-- Function to aggregate activities for the feed
CREATE OR REPLACE FUNCTION get_activity_feed(
  filter_type TEXT DEFAULT 'all',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  activity_id UUID,
  activity_type VARCHAR(50),
  developer_id UUID,
  developer_name TEXT,
  developer_avatar TEXT,
  developer_headline TEXT,
  developer_skills TEXT[],
  activity_title TEXT,
  activity_description TEXT,
  activity_metadata JSONB,
  activity_timestamp TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    da.id,
    da.activity_type,
    da.developer_id,
    p.name,
    p.avatar_url,
    dp.headline,
    ARRAY(
      SELECT s.name 
      FROM user_skills us 
      JOIN skills s ON us.skill_id = s.id 
      WHERE us.user_id = da.developer_id 
      ORDER BY us.proficiency_level DESC 
      LIMIT 5
    ),
    da.title,
    da.description,
    da.metadata,
    da.created_at
  FROM developer_activities da
  JOIN profiles p ON da.developer_id = p.id
  LEFT JOIN developer_profiles dp ON da.developer_id = dp.id
  WHERE 
    da.is_public = true
    AND (filter_type = 'all' OR da.activity_type = filter_type)
    AND p.user_type = 'developer'
  ORDER BY da.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_developer_profiles_headline ON developer_profiles(headline);

-- Grant permissions
GRANT EXECUTE ON FUNCTION track_profile_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_activity_feed TO authenticated; 