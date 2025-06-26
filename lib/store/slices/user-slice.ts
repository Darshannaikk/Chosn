import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  bio: string;
  skills: string[];
  experience: number;
  location: string;
  timezone: string;
  availability: 'available' | 'busy' | 'not-looking';
  portfolio: {
    projects: Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      url?: string;
      github?: string;
      image?: string;
    }>;
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      date: string;
      type: 'certification' | 'award' | 'publication' | 'speaking';
    }>;
  };
  preferences: {
    jobTypes: string[];
    salaryRange: { min: number; max: number };
    remoteOnly: boolean;
    companySizes: string[];
    industries: string[];
  };
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProfile, updateProfile, setLoading, setError } = userSlice.actions;