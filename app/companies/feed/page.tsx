"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity,
  Code2,
  GitBranch,
  GitCommit,
  Star,
  Trophy,
  Zap,
  TrendingUp,
  MessageSquare,
  Filter,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { messagingService } from '@/lib/api/messaging';
import { activityTrackingService, type Activity as ActivityType } from '@/lib/services/activity-tracking';

export default function ActivityFeedPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [filter]);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const data = await activityTrackingService.getActivityFeed(filter);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadActivities();
    setIsRefreshing(false);
    toast.success('Feed refreshed!');
  };

  const handleContact = async (developerId: string, developerName: string) => {
    try {
      // Create or get existing conversation
      const conversation = await messagingService.createConversation(developerId);
      if (conversation) {
        router.push(`/messages?conversation=${conversation.id}`);
      }
    } catch (error) {
      toast.error('Failed to start conversation');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'github_commit':
      case 'github_push':
        return <GitCommit className="w-4 h-4" />;
      case 'skill_added':
      case 'skill_validated':
        return <Zap className="w-4 h-4" />;
      case 'profile_update':
        return <TrendingUp className="w-4 h-4" />;
      case 'achievement_earned':
        return <Trophy className="w-4 h-4" />;
      case 'availability_change':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'github_commit':
      case 'github_push':
        return 'text-blue-500 bg-blue-500/10';
      case 'skill_added':
      case 'skill_validated':
        return 'text-purple-500 bg-purple-500/10';
      case 'profile_update':
        return 'text-green-500 bg-green-500/10';
      case 'achievement_earned':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'availability_change':
        return 'text-emerald-500 bg-emerald-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const renderActivityContent = (activity: ActivityType) => {
    const { metadata } = activity;
    
    switch (activity.type) {
      case 'github_commit':
      case 'github_push':
        return (
          <div className="space-y-2">
            <p className="text-sm">{activity.description}</p>
            {metadata?.repo_name && (
              <p className="text-sm text-muted-foreground">
                Repository: <span className="font-medium">{metadata.repo_name}</span>
              </p>
            )}
            {metadata?.additions !== undefined && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="text-green-600">+{metadata.additions}</span>
                <span className="text-red-600">-{metadata.deletions || 0}</span>
                {metadata.language && (
                  <Badge variant="secondary" className="text-xs">
                    {metadata.language}
                  </Badge>
                )}
              </div>
            )}
          </div>
        );
      
      case 'skill_added':
      case 'skill_validated':
        return (
          <div className="space-y-2">
            <p className="text-sm">{activity.description}</p>
            {metadata?.validated && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                GitHub validated • {metadata.confidence}% confidence
              </div>
            )}
          </div>
        );
      
      case 'availability_change':
        return (
          <p className="text-sm">{activity.description}</p>
        );
      
      case 'achievement_earned':
        return (
          <div className="space-y-2">
            <p className="text-sm">{activity.description}</p>
          </div>
        );
      
      default:
        return <p className="text-sm">{activity.description}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Developer Activity Feed</h1>
              <p className="text-muted-foreground">
                Real-time updates from developers showcasing their skills and achievements
              </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter activities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="github_commit">GitHub Commits</SelectItem>
                        <SelectItem value="skill_validated">Validated Skills</SelectItem>
                        <SelectItem value="availability_change">Availability Updates</SelectItem>
                        <SelectItem value="achievement_earned">Achievements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Activity Icon */}
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                              {/* Developer Info */}
                              {activity.developer && (
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={activity.developer.avatar} />
                                    <AvatarFallback>
                                      {activity.developer.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">{activity.developer.name}</h3>
                                      <span className="text-sm text-muted-foreground">•</span>
                                      <span className="text-sm text-muted-foreground">
                                        {activity.developer.headline}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Activity Content */}
                              <div>
                                <h4 className="font-medium mb-1">{activity.title}</h4>
                                {renderActivityContent(activity)}
                              </div>

                              {/* Developer Skills */}
                              {activity.developer && activity.developer.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {activity.developer.skills.slice(0, 3).map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {activity.developer.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{activity.developer.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Actions */}
                              {activity.developer && (
                                <div className="flex items-center gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => router.push(`/developers/${activity.developer!.id}`)}
                                  >
                                    View Profile
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleContact(activity.developer!.id, activity.developer!.name)}
                                  >
                                    <MessageSquare className="w-3 h-3 mr-2" />
                                    Contact
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!isLoading && activities.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No activities found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Activities will appear here as developers update their profiles and push code
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 