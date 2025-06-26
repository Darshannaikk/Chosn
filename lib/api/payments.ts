interface CreateCheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  trialDays?: number;
}

interface CheckoutSession {
  id: string;
  url: string;
}

interface PortalSession {
  url: string;
}

class PaymentsService {
  private baseUrl = '/api/stripe';

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.session;
  }

  async createPortalSession(returnUrl: string): Promise<PortalSession> {
    const response = await fetch(`${this.baseUrl}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ returnUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const data = await response.json();
    return data.session;
  }

  async getSubscription(subscriptionId: string) {
    const response = await fetch(`${this.baseUrl}/subscription?id=${subscriptionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    return response.json();
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
    const response = await fetch(`${this.baseUrl}/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId, cancelAtPeriodEnd }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  }

  // Mock implementation for development
  async mockCreateCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock session
    const sessionId = `cs_mock_${Date.now()}`;
    const mockUrl = `${params.successUrl}?session_id=${sessionId}`;
    
    return {
      id: sessionId,
      url: mockUrl,
    };
  }

  async mockCreatePortalSession(returnUrl: string): Promise<PortalSession> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For development, just return to the return URL
    return {
      url: returnUrl,
    };
  }
}

export const paymentsService = new PaymentsService();

// Utility functions for pricing
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateProration(
  currentPlan: { price: number; daysRemaining: number },
  newPlan: { price: number },
  billingCycleDays = 30
): number {
  const currentPlanDailyRate = currentPlan.price / billingCycleDays;
  const newPlanDailyRate = newPlan.price / billingCycleDays;
  
  const refund = currentPlanDailyRate * currentPlan.daysRemaining;
  const newCharge = newPlanDailyRate * currentPlan.daysRemaining;
  
  return Math.max(0, newCharge - refund);
}

export function getTrialEndDate(trialDays: number): Date {
  const now = new Date();
  return new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
}

export function isValidPromoCode(code: string): boolean {
  // Mock promo code validation
  const validCodes = ['LAUNCH50', 'BETA25', 'STUDENT20'];
  return validCodes.includes(code.toUpperCase());
}

export function getPromoDiscount(code: string): number {
  const discounts: Record<string, number> = {
    'LAUNCH50': 0.5,
    'BETA25': 0.25,
    'STUDENT20': 0.2,
  };
  
  return discounts[code.toUpperCase()] || 0;
}