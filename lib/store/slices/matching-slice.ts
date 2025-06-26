import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface MatchingState {
  matches: Match[];
  activeMatches: Match[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchingState = {
  matches: [],
  activeMatches: [],
  isLoading: false,
  error: null,
};

export const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    addMatch: (state, action: PayloadAction<Match>) => {
      state.matches.unshift(action.payload);
    },
    updateMatchStatus: (state, action: PayloadAction<{ id: string; status: Match['status'] }>) => {
      const match = state.matches.find(m => m.id === action.payload.id);
      if (match) {
        match.status = action.payload.status;
      }
    },
    setActiveMatches: (state, action: PayloadAction<Match[]>) => {
      state.activeMatches = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMatches,
  addMatch,
  updateMatchStatus,
  setActiveMatches,
  setLoading,
  setError,
} = matchingSlice.actions;