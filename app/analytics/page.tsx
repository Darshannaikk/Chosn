"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase,
  DollarSign,
  Clock,
  Target,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'Profile Views',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Company Matches',
      value: '23',
      change: '+8.2%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Interview Requests',
      value: '7',
      change: '+15.4%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Success Rate',
      value: '94%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentActivity = [
    {
      type: 'view',
      company: 'Google',
      action: 'viewed your profile',
      time: '2 hours ago',
      icon: Eye,
    },
    {
      type: 'match',
      company: 'Netflix',
      action: 'matched with your profile',
      time: '5 hours ago',
      icon: Target,
    },
    {
      type: 'interview',
      company: 'Spotify',
      action: 'requested an interview',
      time: '1 day ago',
      icon: MessageSquare,
    },
    {
      type: 'view',
      company: 'Meta',
      action: 'viewed your profile',
      time: '2 days ago',
      icon: Eye,
    },
  ];

  const topSkills = [
    { skill: 'React', matches: 18, percentage: 78 },
    { skill: 'Node.js', matches: 15, percentage: 65 },
    { skill: 'TypeScript', matches: 14, percentage: 61 },
    { skill: 'Python', matches: 12, percentage: 52 },
    { skill: 'AWS', matches: 10, percentage: 43 },
  ];

  const salaryInsights = {
    current: '$165,000',
    market: '$180,000',
    potential: '$195,000',
    percentile: '75th',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Badge variant="secondary" className="mb-4 px-4 py-2">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics Dashboard
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                      Your <span className="gradient-text">Performance</span> Insights
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Track your profile performance and discover opportunities for growth
                    </p>
                  </div>
                  <Button className="gradient-bg">
                    Export Report
                  </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color}`}>
                              <metric.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm ${
                              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {metric.trend === 'up' ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              )}
                              <span>{metric.change}</span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold mb-1">{metric.value}</div>
                          <div className="text-sm text-muted-foreground">{metric.title}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Analytics */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="p-2 rounded-lg bg-muted">
                            <activity.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{activity.company}</div>
                            <div className="text-sm text-muted-foreground">{activity.action}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Skills */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>Top Matching Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topSkills.map((skill, index) => (
                        <div key={skill.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-sm text-muted-foreground">{skill.matches} matches</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Salary Insights */}
            <motion.div
              className="max-w-4xl mx-auto mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Salary Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-primary mb-1">{salaryInsights.current}</div>
                      <div className="text-sm text-muted-foreground">Current Range</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">{salaryInsights.market}</div>
                      <div className="text-sm text-muted-foreground">Market Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{salaryInsights.potential}</div>
                      <div className="text-sm text-muted-foreground">Potential Max</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-accent mb-1">{salaryInsights.percentile}</div>
                      <div className="text-sm text-muted-foreground">Percentile</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Insight:</strong> Your profile is performing well! Companies in your skill range are offering 
                      15% above market average. Consider highlighting your React and Node.js experience to attract higher offers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="max-w-4xl mx-auto mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="p-1 bg-blue-500 rounded-full">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Update your portfolio</div>
                        <div className="text-sm text-muted-foreground">
                          Add your recent React project to increase matches by an estimated 25%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="p-1 bg-green-500 rounded-full">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Highlight AWS certification</div>
                        <div className="text-sm text-muted-foreground">
                          Cloud skills are in high demand - showcase your AWS expertise
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="p-1 bg-purple-500 rounded-full">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Expand location preferences</div>
                        <div className="text-sm text-muted-foreground">
                          Consider remote opportunities to access 40% more matches
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}