"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  X, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users,
  Building,
  Star,
  MessageSquare,
  ExternalLink,
  Filter,
  SortDesc,
  Briefcase,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/use-auth';
import { useAppDispatch } from '@/lib/hooks/use-app-dispatch';
import { useAppSelector } from '@/lib/hooks/use-app-selector';
import { fetchMatches, respondToMatch } from '@/lib/api/matching';
import { toast } from 'sonner';

export default function MatchesPage() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { matches, isLoading } = useAppSelector((state) => state.matching);
  const [filter, setFilter] = useState<'all' | 'pending' | 'interested' | 'declined'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchMatches(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

  const handleResponse = async (matchId: string, response: 'interested' | 'declined') => {
    try {
      await dispatch(respondToMatch(matchId, response)).unwrap();
      toast.success(response === 'interested' ? 'Great! We\'ll notify the company.' : 'Thanks for your feedback.');
    } catch (error) {
      toast.error('Failed to respond to match');
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'score') {
      return b.matchScore - a.matchScore;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to view your matches.</p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
                  <p className="text-muted-foreground">
                    Companies that are interested in your profile
                  </p>
                </div>
                <Badge variant="secondary" className="px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  {matches.length} Total Matches
                </Badge>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex space-x-2">
                    {['all', 'pending', 'interested', 'declined'].map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status as any)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <SortDesc className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="score">Match Score</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Matches Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded-lg mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedMatches.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                  <p className="text-muted-foreground mb-6">
                    {filter === 'all' 
                      ? "We're working on finding the perfect opportunities for you. Check back soon!"
                      : `No matches with status "${filter}". Try changing your filter.`
                    }
                  </p>
                  <Button asChild>
                    <a href="/profile">Complete Your Profile</a>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {sortedMatches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover-lift group overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-16 h-16 border-2 border-muted">
                                <AvatarImage src={match.companyLogo} alt={match.companyName} />
                                <AvatarFallback className="bg-brand-primary text-white text-lg">
                                  {match.companyName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{match.companyName}</h3>
                                <p className="text-lg text-brand-primary font-medium">{match.position}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                                    <span className="text-sm font-medium">{match.matchScore}% match</span>
                                  </div>
                                  <Badge 
                                    variant={match.status === 'pending' ? 'secondary' : 
                                            match.status === 'interested' ? 'default' : 'outline'}
                                    className="capitalize"
                                  >
                                    {match.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {match.jobDetails.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{match.jobDetails.location}</span>
                              {match.jobDetails.remote && (
                                <Badge variant="outline" className="text-xs">Remote</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>
                                ${match.jobDetails.salaryRange.min.toLocaleString()} - 
                                ${match.jobDetails.salaryRange.max.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Requirements:</h4>
                            <div className="flex flex-wrap gap-2">
                              {match.jobDetails.requirements.slice(0, 4).map((req) => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                              {match.jobDetails.requirements.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{match.jobDetails.requirements.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {match.status === 'pending' && (
                            <div className="flex space-x-3 pt-4">
                              <Button
                                onClick={() => handleResponse(match.id, 'interested')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Heart className="w-4 h-4 mr-2" />
                                Interested
                              </Button>
                              <Button
                                onClick={() => handleResponse(match.id, 'declined')}
                                variant="outline"
                                className="flex-1"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Pass
                              </Button>
                            </div>
                          )}

                          {match.status === 'interested' && (
                            <div className="flex space-x-3 pt-4">
                              <Button className="flex-1" disabled>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Awaiting Response
                              </Button>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(match.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>Company ID: {match.companyId}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}