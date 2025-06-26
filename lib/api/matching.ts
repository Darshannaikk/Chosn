import { createClient } from '@/lib/supabase/client';
import { setMatches, addMatch, updateMatchStatus, setLoading, setError } from '@/lib/store/slices/matching-slice';
import { AppDispatch } from '@/lib/store';

interface Match {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  position: string;
  matchScore: number;
  status: 'pending' | 'interested' | 'declined' | 'interview' | 'offer';
  createdAt: string;
  jobDetails: {
    description: string;
    requirements: string[];
    benefits: string[];
    salaryRange: { min: number; max: number };
    location: string;
    remote: boolean;
  };
}

class MatchingService {
  private supabase = createClient();

  async getMatches(userId: string): Promise<Match[]> {
    try {
      const { data: matches, error } = await this.supabase
        .from('matches')
        .select(`
          *,
          company_profiles!inner(
            company_name,
            profiles!inner(avatar_url)
          )
        `)
        .eq('developer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return matches?.map((match: any) => ({
        id: match.id,
        companyId: match.company_id,
        companyName: match.company_profiles.company_name,
        companyLogo: match.company_profiles.profiles.avatar_url || 
          'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        position: match.position_title,
        matchScore: match.match_score,
        status: match.status,
        createdAt: match.created_at,
        jobDetails: {
          description: match.job_description || '',
          requirements: match.requirements || [],
          benefits: match.benefits || [],
          salaryRange: {
            min: match.salary_min || 0,
            max: match.salary_max || 0,
          },
          location: match.location || '',
          remote: match.remote_allowed || false,
        },
      })) || [];
    } catch (error) {
      console.error('Get matches error:', error);
      throw error;
    }
  }

  async respondToMatch(matchId: string, response: 'interested' | 'declined', message?: string): Promise<void> {
    try {
      // Update match status
      const { error: matchError } = await this.supabase
        .from('matches')
        .update({ status: response })
        .eq('id', matchId);

      if (matchError) {
        throw new Error(matchError.message);
      }

      // Get current user
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Record response
      const { error: responseError } = await this.supabase
        .from('match_responses')
        .insert({
          match_id: matchId,
          developer_id: user.id,
          response,
          message,
        });

      if (responseError) {
        throw new Error(responseError.message);
      }

      // Track analytics
      await this.trackEvent(user.id, 'match_response', {
        match_id: matchId,
        response,
        message,
      });
    } catch (error) {
      console.error('Respond to match error:', error);
      throw error;
    }
  }

  async getRecommendations(userId: string): Promise<Match[]> {
    try {
      // Get user skills for better matching
      const { data: userSkills } = await this.supabase
        .from('user_skills')
        .select('skills(name)')
        .eq('user_id', userId);

      // For now, return recent matches as recommendations
      // In a real implementation, this would use AI/ML algorithms
      const { data: matches, error } = await this.supabase
        .from('matches')
        .select(`
          *,
          company_profiles!inner(
            company_name,
            profiles!inner(avatar_url)
          )
        `)
        .eq('developer_id', userId)
        .eq('status', 'pending')
        .order('match_score', { ascending: false })
        .limit(3);

      if (error) {
        throw new Error(error.message);
      }

      return matches?.map((match: any) => ({
        id: match.id,
        companyId: match.company_id,
        companyName: match.company_profiles.company_name,
        companyLogo: match.company_profiles.profiles.avatar_url || 
          'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        position: match.position_title,
        matchScore: match.match_score,
        status: match.status,
        createdAt: match.created_at,
        jobDetails: {
          description: match.job_description || '',
          requirements: match.requirements || [],
          benefits: match.benefits || [],
          salaryRange: {
            min: match.salary_min || 0,
            max: match.salary_max || 0,
          },
          location: match.location || '',
          remote: match.remote_allowed || false,
        },
      })) || [];
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }

  async submitFeedback(matchId: string, feedback: { rating: number; comment: string }): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      await this.trackEvent(user.id, 'match_feedback', {
        match_id: matchId,
        rating: feedback.rating,
        comment: feedback.comment,
      });
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  }

  async createMatch(data: {
    developerId: string;
    companyId: string;
    positionTitle: string;
    jobDescription?: string;
    requirements?: string[];
    benefits?: string[];
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    remoteAllowed?: boolean;
    matchScore?: number;
  }): Promise<string> {
    try {
      const { data: match, error } = await this.supabase
        .from('matches')
        .insert({
          developer_id: data.developerId,
          company_id: data.companyId,
          position_title: data.positionTitle,
          job_description: data.jobDescription,
          requirements: data.requirements || [],
          benefits: data.benefits || [],
          salary_min: data.salaryMin,
          salary_max: data.salaryMax,
          location: data.location,
          remote_allowed: data.remoteAllowed || false,
          match_score: data.matchScore || 0,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Send email notification to developer
      try {
        // Get developer profile
        const { data: developerProfile } = await this.supabase
          .from('profiles')
          .select('email, name, email_preferences')
          .eq('id', data.developerId)
          .single();

        // Get company profile
        const { data: companyProfile } = await this.supabase
          .from('company_profiles')
          .select('company_name')
          .eq('id', data.companyId)
          .single();

        // Check email preferences
        if (developerProfile && developerProfile.email_preferences?.match_interest !== false && companyProfile) {
          const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/matches`;
          
          await fetch('/api/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'match-interest',
              data: {
                recipientEmail: developerProfile.email,
                recipientName: developerProfile.name || 'Developer',
                interestedUserName: companyProfile.company_name,
                interestedUserType: 'company',
                profileUrl,
              },
            }),
          });
        }
      } catch (error) {
        console.error('Error sending match interest notification:', error);
        // Don't fail match creation if email fails
      }

      return match.id;
    } catch (error) {
      console.error('Create match error:', error);
      throw error;
    }
  }

  private async trackEvent(userId: string, eventType: string, eventData: any): Promise<void> {
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
}

export const matchingService = new MatchingService();

// Redux thunks for matching
export const fetchMatches = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const matches = await matchingService.getMatches(userId);
    dispatch(setMatches(matches));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch matches';
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const respondToMatch = (matchId: string, response: 'interested' | 'declined', message?: string) => 
  async (dispatch: AppDispatch) => {
    try {
      await matchingService.respondToMatch(matchId, response, message);
      dispatch(updateMatchStatus({ id: matchId, status: response }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to respond to match';
      dispatch(setError(message));
    }
  };

export const fetchRecommendations = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const recommendations = await matchingService.getRecommendations(userId);
    console.log('Recommendations:', recommendations);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch recommendations';
    dispatch(setError(message));
  }
};