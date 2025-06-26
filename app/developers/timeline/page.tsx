"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Eye,
  CheckCircle,
  Calendar,
  Lock,
  Unlock,
  Share2,
  Download,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  type: 'github_push' | 'skill_validated' | 'profile_view' | 'message_received' | 'achievement' | 'match';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
  metadata?: any;
}

// Mock timeline data
const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    type: 'github_push',
    title: 'Pushed to main branch',
    description: 'Updated authentication system in awesome-react-app',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: <GitCommit className="w-4 h-4" />,
    color: 'bg-blue-500',
    metadata: { commits: 3, additions: 245, deletions: 67 }
  },
  {
    id: '2',
    type: 'skill_validated',
    title: 'New skill validated',
    description: 'Kubernetes added with 85% confidence',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'bg-green-500',
    metadata: { skill: 'Kubernetes', confidence: 85 }
  },
  {
    id: '3',
    type: 'profile_view',
    title: 'Profile viewed',
    description: 'TechCorp viewed your profile',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    icon: <Eye className="w-4 h-4" />,
    color: 'bg-purple-500',
    metadata: { company: 'TechCorp' }
  },
  {
    id: '4',
    type: 'message_received',
    title: 'New message',
    description: 'Received message from StartupXYZ',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'bg-indigo-500',
    metadata: { from: 'StartupXYZ' }
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Achievement unlocked',
    description: 'Earned AWS Solutions Architect certification',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    icon: <Trophy className="w-4 h-4" />,
    color: 'bg-yellow-500',
    metadata: { certification: 'AWS Solutions Architect' }
  }
];

export default function DeveloperTimelinePage() {
  const { user } = useAuth();
  const [timeline] = useState<TimelineEvent[]>(mockTimeline);
  const [isPublic, setIsPublic] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const handleShare = () => {
    const url = `${window.location.origin}/developers/${user?.id}/timeline`;
    navigator.clipboard.writeText(url);
    toast.success('Timeline link copied to clipboard!');
  };

  const handleExport = () => {
    // In production, this would generate a PDF or image
    toast.success('Timeline exported successfully!');
  };

  const stats = {
    totalEvents: timeline.length,
    thisWeek: timeline.filter(e => e.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    githubActivity: timeline.filter(e => e.type === 'github_push').length,
    profileViews: timeline.filter(e => e.type === 'profile_view').length,
  };

  const filteredTimeline = filter === 'all' 
    ? timeline 
    : timeline.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">My Developer Timeline</h1>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Track your journey and showcase your progress over time
              </p>
              
              {/* Privacy Toggle */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPublic ? (
                      <Unlock className="w-5 h-5 text-green-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label htmlFor="public-toggle" className="font-medium">
                        Timeline Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {isPublic ? 'Your timeline is public' : 'Your timeline is private'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="public-toggle"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">{stats.thisWeek}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">GitHub Activity</p>
                      <p className="text-2xl font-bold">{stats.githubActivity}</p>
                    </div>
                    <GitBranch className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Profile Views</p>
                      <p className="text-2xl font-bold">{stats.profileViews}</p>
                    </div>
                    <Eye className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Activity Timeline</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="all">All Events</option>
                      <option value="github_push">GitHub Activity</option>
                      <option value="skill_validated">Skills</option>
                      <option value="profile_view">Profile Views</option>
                      <option value="message_received">Messages</option>
                      <option value="achievement">Achievements</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

                  {/* Timeline events */}
                  <div className="space-y-8">
                    {filteredTimeline.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-4"
                      >
                        {/* Icon */}
                        <div className={`relative z-10 p-2 rounded-full text-white ${event.color}`}>
                          {event.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold">{event.title}</h3>
                              <span className="text-xs text-muted-foreground">
                                {format(event.timestamp, 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                            
                            {/* Metadata */}
                            {event.metadata && (
                              <div className="flex flex-wrap gap-2">
                                {event.type === 'github_push' && (
                                  <>
                                    <Badge variant="secondary" className="text-xs">
                                      {event.metadata.commits} commits
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      +{event.metadata.additions} -{event.metadata.deletions}
                                    </Badge>
                                  </>
                                )}
                                {event.type === 'skill_validated' && (
                                  <Badge className="text-xs">
                                    {event.metadata.skill} • {event.metadata.confidence}%
                                  </Badge>
                                )}
                                {event.type === 'profile_view' && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.metadata.company}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 