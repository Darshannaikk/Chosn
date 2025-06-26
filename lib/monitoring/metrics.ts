import { createServerClient } from '@/lib/supabase/server';

export interface PlatformMetrics {
  users: {
    total: number;
    developers: number;
    companies: number;
    activeToday: number;
    activeThisWeek: number;
    growth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  engagement: {
    messages: {
      total: number;
      today: number;
      averageResponseTime: number;
    };
    matches: {
      total: number;
      today: number;
      conversionRate: number;
    };
    githubConnections: {
      total: number;
      today: number;
      percentage: number;
    };
  };
  revenue: {
    mrr: number;
    arr: number;
    growth: number;
    churn: number;
    customers: {
      total: number;
      professional: number;
      enterprise: number;
    };
  };
  social: {
    cardsGenerated: number;
    cardsShared: number;
    conversionRate: number;
    viralCoefficient: number;
  };
  performance: {
    averagePageLoad: number;
    errorRate: number;
    uptime: number;
  };
}

export class MetricsCollector {
  private supabase = createServerClient();

  async collectAllMetrics(): Promise<PlatformMetrics> {
    const [users, engagement, revenue, social, performance] = await Promise.all([
      this.getUserMetrics(),
      this.getEngagementMetrics(),
      this.getRevenueMetrics(),
      this.getSocialMetrics(),
      this.getPerformanceMetrics()
    ]);

    return {
      users,
      engagement,
      revenue,
      social,
      performance
    };
  }

  private async getUserMetrics() {
    // Total users by type
    const { data: profiles } = await this.supabase
      .from('profiles')
      .select('user_type, created_at');

    const total = profiles?.length || 0;
    const developers = profiles?.filter(p => p.user_type === 'developer').length || 0;
    const companies = profiles?.filter(p => p.user_type === 'company').length || 0;

    // Active users
    const { data: activeToday } = await this.supabase
      .from('developer_activities')
      .select('user_id')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .eq('activity_type', 'login');

    const { data: activeThisWeek } = await this.supabase
      .from('developer_activities')
      .select('user_id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .eq('activity_type', 'login');

    // Growth calculations
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data: dailySignups } = await this.supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', yesterday.toISOString());

    const { data: weeklySignups } = await this.supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', lastWeek.toISOString());

    const { data: monthlySignups } = await this.supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', lastMonth.toISOString());

    return {
      total,
      developers,
      companies,
      activeToday: activeToday?.length || 0,
      activeThisWeek: activeThisWeek?.length || 0,
      growth: {
        daily: dailySignups?.length || 0,
        weekly: weeklySignups?.length || 0,
        monthly: monthlySignups?.length || 0
      }
    };
  }

  private async getEngagementMetrics() {
    // Messages
    const { data: allMessages } = await this.supabase
      .from('messages')
      .select('created_at');

    const { data: todayMessages } = await this.supabase
      .from('messages')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // GitHub connections
    const { data: githubConnections } = await this.supabase
      .from('profiles')
      .select('github_username')
      .not('github_username', 'is', null);

    const { data: todayGithubConnections } = await this.supabase
      .from('developer_activities')
      .select('*')
      .eq('activity_type', 'github_connected')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      messages: {
        total: allMessages?.length || 0,
        today: todayMessages?.length || 0,
        averageResponseTime: 2.5 // hours - calculate from actual data
      },
      matches: {
        total: 156, // Calculate from company_interests table
        today: 23,
        conversionRate: 15.2 // percentage
      },
      githubConnections: {
        total: githubConnections?.length || 0,
        today: todayGithubConnections?.length || 0,
        percentage: 67.8 // percentage of developers
      }
    };
  }

  private async getRevenueMetrics() {
    // This would integrate with Stripe API for real revenue data
    return {
      mrr: 15400,
      arr: 184800,
      growth: 45.2,
      churn: 2.1,
      customers: {
        total: 89,
        professional: 67,
        enterprise: 22
      }
    };
  }

  private async getSocialMetrics() {
    const { data: cardsGenerated } = await this.supabase
      .from('social_card_shares')
      .select('*')
      .eq('action', 'generated');

    const { data: cardsShared } = await this.supabase
      .from('social_card_shares')
      .select('*')
      .eq('action', 'shared');

    const generated = cardsGenerated?.length || 0;
    const shared = cardsShared?.length || 0;

    return {
      cardsGenerated: generated,
      cardsShared: shared,
      conversionRate: shared > 0 ? (shared / generated) * 100 : 0,
      viralCoefficient: 1.23 // Calculate based on referral tracking
    };
  }

  private async getPerformanceMetrics() {
    // These would come from external monitoring services
    return {
      averagePageLoad: 1.2, // seconds
      errorRate: 0.05, // percentage
      uptime: 99.98 // percentage
    };
  }

  async getHealthStatus() {
    try {
      // Test database connection
      const { error } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) throw error;

      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
} 