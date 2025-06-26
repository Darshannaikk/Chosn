"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  DollarSign, 
  TrendingUp,
  GitBranch,
  Mail,
  Eye,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardMetrics {
  users: {
    total: number;
    developers: number;
    companies: number;
    growth: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    growth: number;
  };
  engagement: {
    dau: number;
    messages: number;
    githubConnections: number;
  };
  socialCards: {
    generated: number;
    shared: number;
    conversions: number;
  };
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockMetrics: DashboardMetrics = {
        users: { total: 1247, developers: 892, companies: 355, growth: 23.5 },
        revenue: { mrr: 15400, arr: 184800, growth: 45.2 },
        engagement: { dau: 234, messages: 1829, githubConnections: 567 },
        socialCards: { generated: 89, shared: 156, conversions: 23 }
      };
      
      setMetrics(mockMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const userGrowthData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Developers',
        data: [12, 19, 15, 25, 22, 18, 30],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
      },
      {
        label: 'Companies',
        data: [8, 12, 10, 15, 14, 12, 18],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
      }
    ]
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'MRR ($)',
        data: [5200, 7800, 9500, 12100, 13800, 15400],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }
    ]
  };

  const userTypeData = {
    labels: ['Developers', 'Companies'],
    datasets: [
      {
        data: [metrics?.users.developers || 0, metrics?.users.companies || 0],
        backgroundColor: ['#8B5CF6', '#10B981'],
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform metrics and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button onClick={fetchMetrics} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.users.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{metrics?.users.growth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics?.revenue.mrr.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{metrics?.revenue.growth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.engagement.dau}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((metrics?.engagement.dau || 0) / (metrics?.users.total || 1) * 100)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GitHub Connections</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.engagement.githubConnections}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((metrics?.engagement.githubConnections || 0) / (metrics?.users.developers || 1) * 100)}% of developers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Daily signups over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <Line data={userGrowthData} options={{ responsive: true }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <Bar data={revenueData} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Doughnut data={userTypeData} options={{ responsive: true }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Card Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cards Generated</span>
                  <Badge>{metrics?.socialCards.generated}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cards Shared</span>
                  <Badge>{metrics?.socialCards.shared}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversions</span>
                  <Badge variant="secondary">{metrics?.socialCards.conversions}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversion Rate</span>
                  <Badge variant="outline">
                    {Math.round((metrics?.socialCards.conversions || 0) / (metrics?.socialCards.shared || 1) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payments</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">GitHub API</span>
                  <Badge variant="outline" className="text-yellow-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Rate Limited
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 