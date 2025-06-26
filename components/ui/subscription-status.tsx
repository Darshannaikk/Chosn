"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface SubscriptionStatusProps {
  className?: string;
}

export function SubscriptionStatus({ className }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState({
    plan: 'free', // free, professional, enterprise
    status: 'active', // active, canceled, past_due, trialing
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
    trialEnd: null as Date | null,
  });

  const planDetails = {
    free: {
      name: 'Free',
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
      features: ['Basic matching', '5 applications/month', 'Email support']
    },
    professional: {
      name: 'Professional',
      color: 'bg-blue-100 text-blue-800',
      icon: Crown,
      features: ['Advanced matching', 'Unlimited applications', 'Priority support', 'Analytics dashboard']
    },
    enterprise: {
      name: 'Enterprise',
      color: 'bg-purple-100 text-purple-800',
      icon: Crown,
      features: ['Custom matching', 'Dedicated manager', '24/7 support', 'Custom integrations']
    }
  };

  const currentPlan = planDetails[subscription.plan as keyof typeof planDetails];

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1" />Canceled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <currentPlan.icon className="w-5 h-5" />
            <span>Subscription</span>
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{currentPlan.name} Plan</div>
            <div className="text-sm text-muted-foreground">
              {subscription.status === 'trialing' && subscription.trialEnd
                ? `Trial ends ${subscription.trialEnd.toLocaleDateString()}`
                : `Renews ${subscription.currentPeriodEnd.toLocaleDateString()}`
              }
            </div>
          </div>
          <Badge className={currentPlan.color}>
            {currentPlan.name}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Plan Features:</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {subscription.plan === 'free' && (
          <div className="pt-4 border-t">
            <Button asChild className="w-full gradient-bg">
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Link>
            </Button>
          </div>
        )}

        {subscription.plan !== 'free' && (
          <div className="flex space-x-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        )}

        {subscription.cancelAtPeriodEnd && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Subscription Ending</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Your subscription will end on {subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}