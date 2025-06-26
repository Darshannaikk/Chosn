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

interface ActivityItem {
  id: string;
  type: 'github_commit' | 'skill_added' | 'profile_update' | 'achievement' | 'availability_change';
  developer: {
    id: string;
    name: string;
    avatar?: string;
    headline: string;
    skills: string[];
  };
  timestamp: Date;
  data: any;
}

// Mock data - in production, this would come from your API
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'github_commit',
    developer: {
      id: 'dev1',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      headline: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'TypeScript']
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    data: {
      repo: 'awesome-react-app',
      message: 'Implemented new authentication system with JWT',
      language: 'TypeScript',
      additions: 245,
      deletions: 67
    }
  },
  {
    id: '2',
    type: 'skill_added',
    developer: {
      id: 'dev2',
      name: 'Alex Rivera',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      headline: 'Backend Engineer',
      skills: ['Python', 'Django', 'PostgreSQL']
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    data: {
      skill: 'Kubernetes',
      validated: true,
      confidence: 85
    }
  },
  {
    id: '3',
    type: 'availability_change',
    developer: {
      id: 'dev3',
      name: 'Jordan Kim',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      headline: 'Mobile Developer',
      skills: ['React Native', 'Swift', 'Kotlin']
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    data: {
      from: 'busy',
      to: 'available'
    }
  },
  {
    id: '4',
    type: 'achievement',
    developer: {
      id: 'dev4',
      name: 'Morgan Taylor',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      headline: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Terraform']
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    data: {
      title: 'AWS Solutions Architect',
      type: 'certification'
    }
  }
];

export default function ActivityFeedPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filter, setFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'github_commit':
        return <GitCommit className="w-4 h-4" />;
      case 'skill_added':
        return <Zap className="w-4 h-4" />;
      case 'profile_update':
        return <TrendingUp className="w-4 h-4" />;
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      case 'availability_change':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'github_commit':
        return 'text-blue-500 bg-blue-500/10';
      case 'skill_added':
        return 'text-purple-500 bg-purple-500/10';
      case 'profile_update':
        return 'text-green-500 bg-green-500/10';
      case 'achievement':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'availability_change':
        return 'text-emerald-500 bg-emerald-500/10';
    }
  };

  const renderActivityContent = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'github_commit':
        return (
          <div className="space-y-2">
            <p className="text-sm">
              Made a commit to <span className="font-medium">{activity.data.repo}</span>
            </p>
            <p className="text-sm text-muted-foreground italic">"{activity.data.message}"</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="text-green-600">+{activity.data.additions}</span>
              <span className="text-red-600">-{activity.data.deletions}</span>
              <Badge variant="secondary" className="text-xs">
                {activity.data.language}
              </Badge>
            </div>
          </div>
        );
      
      case 'skill_added':
        return (
          <div className="space-y-2">
            <p className="text-sm">
              Added new skill: <Badge className="ml-1">{activity.data.skill}</Badge>
            </p>
            {activity.data.validated && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                GitHub validated • {activity.data.confidence}% confidence
              </div>
            )}
          </div>
        );
      
      case 'availability_change':
        return (
          <p className="text-sm">
            Changed availability from <span className="text-muted-foreground">{activity.data.from}</span> to{' '}
            <Badge variant="outline" className="text-green-600 border-green-600">
              {activity.data.to}
            </Badge>
          </p>
        );
      
      case 'achievement':
        return (
          <div className="space-y-2">
            <p className="text-sm">
              Earned new {activity.data.type}: <span className="font-medium">{activity.data.title}</span>
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

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
                        <SelectItem value="skill_added">New Skills</SelectItem>
                        <SelectItem value="availability_change">Availability Updates</SelectItem>
                        <SelectItem value="achievement">Achievements</SelectItem>
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
            <div className="space-y-4">
              <AnimatePresence>
                {filteredActivities.map((activity, index) => (
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

                            {/* Activity Content */}
                            {renderActivityContent(activity)}

                            {/* Developer Skills */}
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

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => router.push(`/developers/${activity.developer.id}`)}
                              >
                                View Profile
                                <ExternalLink className="w-3 h-3 ml-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContact(activity.developer.id, activity.developer.name)}
                              >
                                <MessageSquare className="w-3 h-3 mr-2" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredActivities.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No activities found</p>
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