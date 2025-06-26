"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Loader2, Star, MapPin, Remote, Search, Filter, Heart, MessageSquare } from 'lucide-react';
import { matchingAlgorithm, ScoredDeveloper } from '@/lib/services/matching-algorithm';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { messagingService } from '@/lib/api/messaging';

export default function CompanyDashboardPage() {
  const [skillsQuery, setSkillsQuery] = useState('React, TypeScript, Node.js');
  const [remoteOk, setRemoteOk] = useState(true);
  const [experienceRange, setExperienceRange] = useState<[number, number]>([2, 10]);
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState<ScoredDeveloper[]>([]);
  const [interestedDevelopers, setInterestedDevelopers] = useState<string[]>([]);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const skills = skillsQuery.split(',').map((s) => s.trim()).filter(Boolean);
      const results = await matchingAlgorithm.findMatches({
        skills,
        experienceMin: experienceRange[0],
        experienceMax: experienceRange[1],
        remoteOk,
      } as any);
      
      // Since platform is now free, show all results
      setDevelopers(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search developers');
    } finally {
      setLoading(false);
    }
  };

  const handleShowInterest = async (developerId: string) => {
    // Since platform is free, all users can show interest
    if (interestedDevelopers.includes(developerId)) {
      setInterestedDevelopers(interestedDevelopers.filter((id) => id !== developerId));
    } else {
      setInterestedDevelopers([...interestedDevelopers, developerId]);
      toast.success('Interest shown! You can now message this developer.');
    }
  };

  const handleSendMessage = async (developerId: string) => {
    // Since platform is free, all users can send messages
    const conversationId = await messagingService.getOrCreateConversation(developerId);
    if (conversationId) {
      router.push(`/messages?conversation=${conversationId}`);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Developer Discovery</h1>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Search Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Skills (comma separated)</label>
              <Input
                value={skillsQuery}
                onChange={(e) => setSkillsQuery(e.target.value)}
                placeholder="React, TypeScript, Node.js"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Experience Range (years)</label>
              <Slider
                min={0}
                max={20}
                step={1}
                defaultValue={experienceRange}
                onValueChange={(val: number[]) => setExperienceRange([val[0], val[1]] as any)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {experienceRange[0]} - {experienceRange[1]} years
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remoteOk"
                checked={remoteOk}
                onChange={(e) => setRemoteOk(e.target.checked)}
              />
              <label htmlFor="remoteOk" className="text-sm">Remote OK</label>
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}Search
            </Button>
          </CardContent>
        </Card>

        {/* Free Platform Banner */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900">Free Access</h3>
              <p className="text-sm text-green-700">
                🎉 Chosn is completely free! Discover and connect with top developers using GitHub-verified skills.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : developers.length === 0 ? (
          <p>No developers found for the given criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <Card key={dev.id} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    {dev.avatar_url ? (
                      <img src={dev.avatar_url} alt={`${dev.name}'s avatar`} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold">
                        {dev.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{dev.name}</h3>
                      <div className="text-sm text-muted-foreground flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{dev.location || 'Remote'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{dev.matchScore}% match</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {dev.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                    {dev.skills.length > 5 && (
                      <Badge variant="outline">+{dev.skills.length - 5} more</Badge>
                    )}
                  </div>

                  <CardFooter className="flex gap-2">
                    <Button 
                      onClick={() => handleShowInterest(dev.id)}
                      disabled={interestedDevelopers.includes(dev.id)}
                      className="flex-1"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {interestedDevelopers.includes(dev.id) ? 'Interest Shown' : 'Show Interest'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleSendMessage(dev.id)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 