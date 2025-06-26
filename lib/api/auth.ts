import { createClient } from '@/lib/supabase/client';
import { loginStart, loginSuccess, loginFailure, logout } from '@/lib/store/slices/auth-slice';
import { AppDispatch } from '@/lib/store';

interface LoginCredentials {
  email: string;
  password: string;
  userType?: 'developer' | 'company';
}

interface SignupData extends LoginCredentials {
  name: string;
  company?: string;
  userType: 'developer' | 'company';
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'developer' | 'company' | 'admin';
    avatar?: string;
    verified: boolean;
  };
  token: string;
}

// Real Supabase authentication service
class AuthService {
  private supabase = createClient();

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Login failed - no user data received');
      }

      // Get user profile from our profiles table
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Create profile if it doesn't exist
        await this.upsertProfile(data.user);
      }

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: (profile?.user_type || data.user.user_metadata?.user_type || 'developer') as 'developer' | 'company' | 'admin',
        avatar: profile?.avatar_url || data.user.user_metadata?.avatar_url,
        verified: profile?.verified || false,
      };

      return {
        user,
        token: data.session.access_token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
            user_type: signupData.userType,
            company: signupData.company,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Signup failed - no user data received');
      }

      // Create profile in our profiles table
      await this.upsertProfile(data.user);

      // Create type-specific profile
      if (signupData.userType === 'developer') {
        await this.createDeveloperProfile(data.user.id);
      } else if (signupData.userType === 'company') {
        await this.createCompanyProfile(data.user.id, signupData.company || signupData.name);
      }

      // Send welcome email
      try {
        const emailResponse = await fetch('/api/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'welcome',
            data: {
              email: signupData.email,
              name: signupData.name,
              userType: signupData.userType,
            },
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send welcome email');
        }
      } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't fail signup if email fails
      }

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: signupData.name,
        role: signupData.userType as 'developer' | 'company',
        avatar: data.user.user_metadata?.avatar_url,
        verified: false,
      };

      return {
        user,
        token: data.session?.access_token || '',
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error || !data.session || !data.user) {
        return null;
      }

      // Get updated profile
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: (profile?.user_type || 'developer') as 'developer' | 'company' | 'admin',
        avatar: profile?.avatar_url,
        verified: profile?.verified || false,
      };

      return {
        user,
        token: data.session.access_token,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      // Get profile from our table
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email!,
        name: profile?.name || user.user_metadata?.name || 'User',
        role: (profile?.user_type || 'developer') as 'developer' | 'company' | 'admin',
        avatar: profile?.avatar_url,
        verified: profile?.verified || false,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  private async upsertProfile(user: any) {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'User',
          user_type: user.user_metadata?.user_type || 'developer',
          avatar_url: user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Profile upsert error:', error);
      }
    } catch (error) {
      console.error('Profile upsert error:', error);
    }
  }

  private async createDeveloperProfile(userId: string) {
    try {
      const { error } = await this.supabase
        .from('developer_profiles')
        .upsert({
          id: userId,
          bio: '',
          experience_years: 0,
          availability: 'available',
        });

      if (error) {
        console.error('Developer profile creation error:', error);
      }
    } catch (error) {
      console.error('Developer profile creation error:', error);
    }
  }

  private async createCompanyProfile(userId: string, companyName: string) {
    try {
      const { error } = await this.supabase
        .from('company_profiles')
        .upsert({
          id: userId,
          company_name: companyName,
        });

      if (error) {
        console.error('Company profile creation error:', error);
      }
    } catch (error) {
      console.error('Company profile creation error:', error);
    }
  }
}

export const authService = new AuthService();

// Redux thunks for authentication
export const loginUser = (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const response = await authService.login(credentials);
    dispatch(loginSuccess(response));
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    dispatch(loginFailure(message));
    throw error;
  }
};

export const signupUser = (data: SignupData) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const response = await authService.signup(data);
    dispatch(loginSuccess(response));
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    dispatch(loginFailure(message));
    throw error;
  }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await authService.logout();
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
    dispatch(logout());
  }
};

export const initializeAuth = () => async (dispatch: AppDispatch) => {
  try {
    // Check if user is already authenticated
    const user = await authService.getCurrentUser();
    
    if (user) {
      // Try to refresh the session
      const response = await authService.refreshToken();
      if (response) {
        dispatch(loginSuccess(response));
      } else {
        // User exists but session is invalid, logout
        dispatch(logout());
      }
    } else {
      // No authenticated user
      dispatch(logout());
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    dispatch(logout());
  }
};