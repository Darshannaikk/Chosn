"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Github, 
  Star, 
  GitFork, 
  Code2, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Zap
} from 'lucide-react';
import { githubService } from '@/lib/services/github';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

interface GitHubConnectProps {
  onSuccess?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function GitHubConnect({ onSuccess, showDetails = true, className }: GitHubConnectProps) {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [validatedSkills, setValidatedSkills] = useState<any[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleConnect = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsConnecting(true);
    try {
      const { url } = await githubService.connectGitHub();
      
      // Redirect to GitHub OAuth
      window.location.href = url;
    } catch (error) {
      console.error('GitHub connection error:', error);
      toast.error('Failed to connect to GitHub');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!user) return;

    setIsAnalyzing(true);
    try {
      // Get GitHub profile and validate skills
      const [profile, skills] = await Promise.all([
        githubService.getUserProfile(),
        githubService.validateSkills(),
      ]);

      setGithubData(profile);
      setValidatedSkills(skills);

      // Save to profile
      await githubService.saveToProfile(user.id);

      setAnalysisComplete(true);
      toast.success(`GitHub analysis complete! Found ${skills.length} validated skills.`);
      
      onSuccess?.();
    } catch (error) {
      console.error('GitHub analysis error:', error);
      toast.error('Failed to analyze GitHub profile');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (analysisComplete && showDetails) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <CardTitle className="text-lg">GitHub Connected!</CardTitle>
          </div>
          <CardDescription>
            Your GitHub profile has been analyzed and skills validated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {githubData && (
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={githubData.avatar_url} alt={githubData.name} />
                <AvatarFallback>
                  <Github className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{githubData.name || githubData.login}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{githubData.public_repos} repos</span>
                  <span>{githubData.followers} followers</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={`https://github.com/${githubData.login}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </a>
              </Button>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-3">Validated Skills ({validatedSkills.length})</h4>
            <div className="grid grid-cols-1 gap-3">
              {validatedSkills.slice(0, 8).map((skill) => (
                <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant={skill.confidence >= 70 ? 'default' : 'secondary'}>
                        {skill.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {skill.evidence.repositories.length} repositories • 
                      {skill.evidence.recentUsage ? ' Recent usage' : ' Not recently used'} • 
                      {skill.evidence.projectComplexity} level
                    </div>
                  </div>
                  <Progress value={skill.confidence} className="w-20" />
                </div>
              ))}
            </div>
            
            {validatedSkills.length > 8 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                +{validatedSkills.length - 8} more skills validated
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Github className="w-5 h-5" />
          <CardTitle className="text-lg">Connect GitHub</CardTitle>
        </div>
        <CardDescription>
          Validate your skills automatically by analyzing your GitHub repositories and contributions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Automatic Skill Validation</h4>
              <p className="text-xs text-muted-foreground">
                We analyze your code to validate programming languages and frameworks
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Code2 className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Portfolio Integration</h4>
              <p className="text-xs text-muted-foreground">
                Top repositories automatically added to your profile
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Credibility Score</h4>
              <p className="text-xs text-muted-foreground">
                Build trust with companies through verified contributions
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <GitFork className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Activity Tracking</h4>
              <p className="text-xs text-muted-foreground">
                Recent contributions show you're actively coding
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-700 dark:text-blue-300 font-medium">Secure Connection</p>
            <p className="text-blue-600 dark:text-blue-400">
              We only access your public repositories and profile information. No private data is accessed.
            </p>
          </div>
        </div>

        {/* Connect Button */}
        <div className="space-y-3">
          {!analysisComplete && (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting to GitHub...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 mr-2" />
                  Connect GitHub Account
                </>
              )}
            </Button>
          )}

          {/* Analysis button (would appear after OAuth callback) */}
          {false && ( // This would be shown after successful OAuth
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing repositories...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Skills
                </>
              )}
            </Button>
          )}
        </div>

        {/* What happens next */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">What happens next:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>You'll be redirected to GitHub to authorize the connection</li>
            <li>We'll analyze your public repositories and contribution history</li>
            <li>Your skills will be automatically validated and added to your profile</li>
            <li>Companies can see your verified technical abilities</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 