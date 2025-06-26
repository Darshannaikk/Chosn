import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  plan: 'free' | 'professional' | 'enterprise';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  customerId?: string;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  isPro: boolean;
  isEnterprise: boolean;
  canUpgrade: boolean;
  refreshSubscription: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!isAuthenticated || !user) {
      setSubscription(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, simulate subscription data from localStorage
      const storedSubscription = localStorage.getItem(`subscription_${user.id}`);
      
      if (storedSubscription) {
        const parsed = JSON.parse(storedSubscription);
        setSubscription({
          ...parsed,
          currentPeriodStart: new Date(parsed.currentPeriodStart),
          currentPeriodEnd: new Date(parsed.currentPeriodEnd),
          trialEnd: parsed.trialEnd ? new Date(parsed.trialEnd) : undefined,
        });
      } else {
        // Default to free plan
        const defaultSubscription: Subscription = {
          id: `sub_free_${user.id}`,
          status: 'active',
          plan: 'free',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
        };
        
        setSubscription(defaultSubscription);
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(defaultSubscription));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user]);

  const isPro = subscription?.plan === 'professional';
  const isEnterprise = subscription?.plan === 'enterprise';
  const canUpgrade = subscription?.plan === 'free';

  return {
    subscription,
    isLoading,
    error,
    isPro,
    isEnterprise,
    canUpgrade,
    refreshSubscription: fetchSubscription,
  };
}

// Utility functions for subscription checks
export function hasFeature(subscription: Subscription | null, feature: string): boolean {
  if (!subscription) return false;

  const featureMap: Record<string, string[]> = {
    'unlimited_applications': ['professional', 'enterprise'],
    'advanced_matching': ['professional', 'enterprise'],
    'priority_support': ['professional', 'enterprise'],
    'analytics_dashboard': ['professional', 'enterprise'],
    'team_collaboration': ['enterprise'],
    'custom_integrations': ['enterprise'],
    'dedicated_manager': ['enterprise'],
    'api_access': ['enterprise'],
  };

  const allowedPlans = featureMap[feature] || [];
  return allowedPlans.includes(subscription.plan);
}

export function getUsageLimit(subscription: Subscription | null, resource: string): number {
  if (!subscription) return 0;

  const limits: Record<string, Record<string, number>> = {
    applications: {
      free: 5,
      professional: -1, // unlimited
      enterprise: -1,
    },
    profile_views: {
      free: 100,
      professional: -1,
      enterprise: -1,
    },
    team_members: {
      free: 1,
      professional: 5,
      enterprise: -1,
    },
  };

  return limits[resource]?.[subscription.plan] || 0;
}

export function isTrialing(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.status === 'trialing' && 
         subscription.trialEnd && 
         subscription.trialEnd > new Date();
}

export function getDaysUntilRenewal(subscription: Subscription | null): number {
  if (!subscription) return 0;
  const now = new Date();
  const renewalDate = subscription.trialEnd && subscription.trialEnd > now 
    ? subscription.trialEnd 
    : subscription.currentPeriodEnd;
  
  return Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}