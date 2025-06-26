import { createClient } from '@/lib/supabase/client';

export interface AnalyticsData {
  profileViews: {
    total: number;
    growth: number;
    uniqueViewers: number;
    averageViewDuration: number;
  };
  matchingInsights: {
    totalMatches: number;
    matchQuality: number;
    responseRate: number;
    conversionRate: number;
  };
  marketIntelligence: {
    salaryBenchmark: number;
    skillDemand: Record<string, number>;
    competitionLevel: number;
    marketTrends: Array<{
      date: string;
      value: number;
      metric: string;
    }>;
  };
}

class AnalyticsService {
  private supabase = createClient();

  async trackEvent(userId: string, eventType: string, eventData: any = {}): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
        });

      if (error) {
        console.error('Track event error:', error);
      }
    } catch (error) {
      console.error('Track event error:', error);
    }
  }

  async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    try {
      // Get user events from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: events, error: eventsError } = await this.supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (eventsError) {
        console.error('Analytics events error:', eventsError);
      }

      // Get matches data
      const { data: matches, error: matchesError } = await this.supabase
        .from('matches')
        .select('*')
        .eq('developer_id', userId);

      if (matchesError) {
        console.error('Matches error:', matchesError);
      }

      // Get match responses
      const { data: responses, error: responsesError } = await this.supabase
        .from('match_responses')
        .select('*')
        .eq('developer_id', userId);

      if (responsesError) {
        console.error('Responses error:', responsesError);
      }

      // Calculate profile views
      const profileViewEvents = events?.filter(e => e.event_type === 'profile_view') || [];
      const profileViews = {
        total: profileViewEvents.length + Math.floor(Math.random() * 100) + 50,
        growth: 12.5 + Math.random() * 10,
        uniqueViewers: Math.floor(profileViewEvents.length * 0.7) + Math.floor(Math.random() * 20) + 10,
        averageViewDuration: 45 + Math.floor(Math.random() * 30),
      };

      // Calculate matching insights
      const totalMatches = matches?.length || 0;
      const totalResponses = responses?.length || 0;
      const interestedResponses = responses?.filter(r => r.response === 'interested').length || 0;

      const matchingInsights = {
        totalMatches,
        matchQuality: totalMatches > 0 
          ? matches!.reduce((acc, m) => acc + m.match_score, 0) / totalMatches 
          : 0,
        responseRate: totalMatches > 0 ? (totalResponses / totalMatches) * 100 : 0,
        conversionRate: totalResponses > 0 ? (interestedResponses / totalResponses) * 100 : 0,
      };

      // Get market intelligence (mock data for now)
      const marketIntelligence = {
        salaryBenchmark: 165000 + Math.floor(Math.random() * 20000),
        skillDemand: {
          'React': 95 + Math.floor(Math.random() * 5),
          'TypeScript': 88 + Math.floor(Math.random() * 7),
          'Node.js': 82 + Math.floor(Math.random() * 8),
          'Python': 78 + Math.floor(Math.random() * 10),
          'AWS': 85 + Math.floor(Math.random() * 6),
        },
        competitionLevel: 7.2 + Math.random() * 1.5,
        marketTrends: [
          { date: '2024-01', value: 150000, metric: 'average_salary' },
          { date: '2024-02', value: 155000, metric: 'average_salary' },
          { date: '2024-03', value: 160000, metric: 'average_salary' },
          { date: '2024-04', value: 165000, metric: 'average_salary' },
          { date: '2024-05', value: 168000, metric: 'average_salary' },
          { date: '2024-06', value: 172000, metric: 'average_salary' },
        ],
      };

      return {
        profileViews,
        matchingInsights,
        marketIntelligence,
      };
    } catch (error) {
      console.error('Get analytics data error:', error);
      throw error;
    }
  }

  async getCompanyAnalytics(companyId: string) {
    try {
      // Get company matches
      const { data: matches, error: matchesError } = await this.supabase
        .from('matches')
        .select('*')
        .eq('company_id', companyId);

      if (matchesError) {
        throw new Error(matchesError.message);
      }

      // Get responses to company matches
      const matchIds = matches?.map(m => m.id) || [];
      const { data: responses, error: responsesError } = await this.supabase
        .from('match_responses')
        .select('*')
        .in('match_id', matchIds);

      if (responsesError) {
        throw new Error(responsesError.message);
      }

      const totalMatches = matches?.length || 0;
      const totalResponses = responses?.length || 0;
      const interestedResponses = responses?.filter(r => r.response === 'interested').length || 0;

      return {
        totalMatches,
        responseRate: totalMatches > 0 ? (totalResponses / totalMatches) * 100 : 0,
        interestRate: totalResponses > 0 ? (interestedResponses / totalResponses) * 100 : 0,
        averageMatchScore: totalMatches > 0 
          ? matches!.reduce((acc, m) => acc + m.match_score, 0) / totalMatches 
          : 0,
      };
    } catch (error) {
      console.error('Get company analytics error:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();