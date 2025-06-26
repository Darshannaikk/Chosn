import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';

export type SubscriptionPlan = 'free' | 'professional' | 'enterprise';

export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan;
  canAccessFeature: (feature: FeatureName) => boolean;
  daysUntilRenewal?: number;
  isTrialing?: boolean;
}

export type FeatureName = 
  | 'view_developers'
  | 'send_messages'
  | 'unlimited_messages'
  | 'advanced_filters'
  | 'priority_support'
  | 'api_access'
  | 'bulk_messaging'
  | 'team_accounts';

// Feature access matrix
const FEATURE_ACCESS: Record<SubscriptionPlan, FeatureName[]> = {
  free: ['view_developers'], // Can only browse, not interact
  professional: [
    'view_developers',
    'send_messages',
    'unlimited_messages',
    'advanced_filters',
  ],
  enterprise: [
    'view_developers',
    'send_messages',
    'unlimited_messages',
    'advanced_filters',
    'priority_support',
    'api_access',
    'bulk_messaging',
    'team_accounts',
  ],
};

class SubscriptionGuard {
  private supabase = createClient();

  async getSubscriptionStatus(userId?: string): Promise<SubscriptionStatus> {
    try {
      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) {
          return this.getFreeStatus();
        }
        userId = user.id;
      }

      // Check if user is a developer (they don't need subscriptions)
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (profile?.user_type === 'developer') {
        // Developers have full access
        return {
          isActive: true,
          plan: 'enterprise', // Give developers full access
          canAccessFeature: () => true,
        };
      }

      // Get subscription for companies
      const { data: subscription } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!subscription || subscription.status !== 'active') {
        return this.getFreeStatus();
      }

      const currentPeriodEnd = new Date(subscription.current_period_end);
      const now = new Date();
      const daysUntilRenewal = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isActive: true,
        plan: subscription.plan as SubscriptionPlan,
        canAccessFeature: (feature: FeatureName) => {
          return FEATURE_ACCESS[subscription.plan as SubscriptionPlan].includes(feature);
        },
        daysUntilRenewal,
        isTrialing: subscription.trial_end ? new Date(subscription.trial_end) > now : false,
      };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return this.getFreeStatus();
    }
  }

  private getFreeStatus(): SubscriptionStatus {
    return {
      isActive: false,
      plan: 'free',
      canAccessFeature: (feature: FeatureName) => {
        return FEATURE_ACCESS.free.includes(feature);
      },
    };
  }

  // Server-side version for API routes
  async getSubscriptionStatusServer(userId: string) {
    const supabase = createServerClient();
    
    try {
      // Check if user is a developer
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (profile?.user_type === 'developer') {
        return {
          isActive: true,
          plan: 'enterprise' as SubscriptionPlan,
          canAccessFeature: () => true,
        };
      }

      // Get subscription for companies
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!subscription || subscription.status !== 'active') {
        return this.getFreeStatus();
      }

      return {
        isActive: true,
        plan: subscription.plan as SubscriptionPlan,
        canAccessFeature: (feature: FeatureName) => {
          return FEATURE_ACCESS[subscription.plan as SubscriptionPlan].includes(feature);
        },
      };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return this.getFreeStatus();
    }
  }

  // Check if a specific feature is available
  async canAccessFeature(feature: FeatureName, userId?: string): Promise<boolean> {
    const status = await this.getSubscriptionStatus(userId);
    return status.canAccessFeature(feature);
  }

  // Get feature limits based on plan
  getFeatureLimits(plan: SubscriptionPlan) {
    const limits = {
      free: {
        viewDevelopers: 5, // Can only see 5 developers
        messagesPerMonth: 0,
        savedSearches: 0,
      },
      professional: {
        viewDevelopers: -1, // Unlimited
        messagesPerMonth: -1, // Unlimited
        savedSearches: 10,
      },
      enterprise: {
        viewDevelopers: -1,
        messagesPerMonth: -1,
        savedSearches: -1, // Unlimited
        teamMembers: 10,
      },
    };

    return limits[plan];
  }
}

export const subscriptionGuard = new SubscriptionGuard(); 