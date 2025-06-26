import { useEffect } from 'react';
import { useAppSelector } from './use-app-selector';
import { useAppDispatch } from './use-app-dispatch';
import { initializeAuth } from '@/lib/api/auth';
import { authService } from '@/lib/api/auth';
import { loginSuccess, logout } from '@/lib/store/slices/auth-slice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state?.auth);

  // Provide fallback values if auth state is not available
  const { user, isAuthenticated, isLoading, error } = authState || {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  useEffect(() => {
    // Only initialize auth if dispatch is available
    if (dispatch && typeof dispatch === 'function') {
      dispatch(initializeAuth());

      // Listen to auth state changes
      const { data: { subscription } } = authService.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            // User signed in, get their profile
            const user = await authService.getCurrentUser();
            if (user) {
              dispatch(loginSuccess({
                user,
                token: session.access_token,
              }));
            }
          } else if (event === 'SIGNED_OUT') {
            // User signed out
            dispatch(logout());
          } else if (event === 'TOKEN_REFRESHED' && session) {
            // Token refreshed, update user data
            const user = await authService.getCurrentUser();
            if (user) {
              dispatch(loginSuccess({
                user,
                token: session.access_token,
              }));
            }
          }
        }
      );

      // Cleanup subscription on unmount
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
}