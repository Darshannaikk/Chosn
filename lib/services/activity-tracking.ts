import { createClient } from '@/lib/supabase/client';

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  metadata: any;
  timestamp: Date;
  developer?: {
    id: string;
    name: string;
    avatar?: string;
    headline?: string;
    skills: string[];
  };
}

export interface ProfileView {
  id: string;
  viewerId: string;
  viewedId: string;
  viewerCompany?: string;
  viewedAt: Date;
}

export interface TimelineSettings {
  isPublic: boolean;
  showGithubActivity: boolean;
  showSkillUpdates: boolean;
  showProfileViews: boolean;
  showMessages: boolean;
  showAchievements: boolean;
}

class ActivityTrackingService {
  private supabase = createClient();

  // Track when a profile is viewed
  async trackProfileView(viewedUserId: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('track_profile_view', {
        viewed_user_id: viewedUserId
      });

      if (error) {
        console.error('Error tracking profile view:', error);
      }
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  }

  // Create a new activity
  async createActivity(
    type: string,
    title: string,
    description: string,
    metadata: any = {},
    isPublic: boolean = true
  ): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      const { error } = await this.supabase
        .from('developer_activities')
        .insert({
          developer_id: user.id,
          activity_type: type,
          title,
          description,
          metadata,
          is_public: isPublic
        });

      if (error) {
        console.error('Error creating activity:', error);
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  }

  // Get activity feed for companies
  async getActivityFeed(
    filter: string = 'all',
    limit: number = 50,
    offset: number = 0
  ): Promise<Activity[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_activity_feed', {
        filter_type: filter,
        limit_count: limit,
        offset_count: offset
      });

      if (error) {
        console.error('Error fetching activity feed:', error);
        return [];
      }

      return data.map((item: any) => ({
        id: item.activity_id,
        type: item.activity_type,
        title: item.activity_title,
        description: item.activity_description,
        metadata: item.activity_metadata,
        timestamp: new Date(item.activity_timestamp),
        developer: {
          id: item.developer_id,
          name: item.developer_name,
          avatar: item.developer_avatar,
          headline: item.developer_headline,
          skills: item.developer_skills || []
        }
      }));
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return [];
    }
  }

  // Get developer's own timeline
  async getDeveloperTimeline(developerId?: string): Promise<Activity[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      const targetId = developerId || user?.id;
      
      if (!targetId) return [];

      const { data, error } = await this.supabase
        .from('developer_activities')
        .select('*')
        .eq('developer_id', targetId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching timeline:', error);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        type: item.activity_type,
        title: item.title,
        description: item.description,
        metadata: item.metadata,
        timestamp: new Date(item.created_at)
      }));
    } catch (error) {
      console.error('Error fetching timeline:', error);
      return [];
    }
  }

  // Get profile view analytics
  async getProfileViews(developerId?: string): Promise<ProfileView[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      const targetId = developerId || user?.id;
      
      if (!targetId) return [];

      const { data, error } = await this.supabase
        .from('profile_views')
        .select(`
          *,
          viewer:profiles!viewer_id(name, avatar_url),
          company:company_profiles!viewer_company_id(company_name)
        `)
        .eq('viewed_id', targetId)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching profile views:', error);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        viewerId: item.viewer_id,
        viewedId: item.viewed_id,
        viewerCompany: item.company?.company_name,
        viewedAt: new Date(item.viewed_at)
      }));
    } catch (error) {
      console.error('Error fetching profile views:', error);
      return [];
    }
  }

  // Track social card share
  async trackSocialCardShare(platform: string, referrerUrl?: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      const { error } = await this.supabase
        .from('social_card_shares')
        .insert({
          developer_id: user.id,
          platform,
          referrer_url: referrerUrl
        });

      if (error) {
        console.error('Error tracking social card share:', error);
      }
    } catch (error) {
      console.error('Error tracking social card share:', error);
    }
  }

  // Get social card analytics
  async getSocialCardAnalytics(developerId?: string): Promise<any> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      const targetId = developerId || user?.id;
      
      if (!targetId) return null;

      const { data, error } = await this.supabase
        .from('social_card_shares')
        .select('*')
        .eq('developer_id', targetId)
        .order('shared_at', { ascending: false });

      if (error) {
        console.error('Error fetching social card analytics:', error);
        return null;
      }

      // Aggregate analytics
      const analytics = {
        totalShares: data.length,
        platforms: {} as Record<string, number>,
        conversions: data.filter(s => s.resulted_in_signup).length,
        recentShares: data.slice(0, 10)
      };

      data.forEach(share => {
        analytics.platforms[share.platform] = (analytics.platforms[share.platform] || 0) + 1;
      });

      return analytics;
    } catch (error) {
      console.error('Error fetching social card analytics:', error);
      return null;
    }
  }

  // Update timeline settings
  async updateTimelineSettings(settings: Partial<TimelineSettings>): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      const { error } = await this.supabase
        .from('developer_timeline_settings')
        .upsert({
          developer_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating timeline settings:', error);
      }
    } catch (error) {
      console.error('Error updating timeline settings:', error);
    }
  }

  // Get timeline settings
  async getTimelineSettings(developerId?: string): Promise<TimelineSettings | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      const targetId = developerId || user?.id;
      
      if (!targetId) return null;

      const { data, error } = await this.supabase
        .from('developer_timeline_settings')
        .select('*')
        .eq('developer_id', targetId)
        .single();

      if (error) {
        // Return defaults if no settings exist
        return {
          isPublic: false,
          showGithubActivity: true,
          showSkillUpdates: true,
          showProfileViews: true,
          showMessages: false,
          showAchievements: true
        };
      }

      return {
        isPublic: data.is_public,
        showGithubActivity: data.show_github_activity,
        showSkillUpdates: data.show_skill_updates,
        showProfileViews: data.show_profile_views,
        showMessages: data.show_messages,
        showAchievements: data.show_achievements
      };
    } catch (error) {
      console.error('Error fetching timeline settings:', error);
      return null;
    }
  }

  // Cache GitHub activity
  async cacheGitHubActivity(activities: any[]): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      const records = activities.map(activity => ({
        developer_id: user.id,
        activity_type: activity.type,
        repo_name: activity.repo,
        commit_message: activity.message,
        commit_sha: activity.sha,
        language: activity.language,
        additions: activity.additions || 0,
        deletions: activity.deletions || 0,
        activity_date: activity.date
      }));

      const { error } = await this.supabase
        .from('github_activity_cache')
        .upsert(records, { onConflict: 'developer_id,commit_sha' });

      if (error) {
        console.error('Error caching GitHub activity:', error);
      }
    } catch (error) {
      console.error('Error caching GitHub activity:', error);
    }
  }
}

export const activityTrackingService = new ActivityTrackingService(); 