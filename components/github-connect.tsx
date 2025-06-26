"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Github, 
  Star, 
  Code2, 
  CheckCircle, 
  AlertCircle,
  Loader2,
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
  const [validatedSkills, setValidatedSkills] = useState<any[]>([]);

  const handleConnect = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsConnecting(true);
    try {
      const { url } = await githubService.connectGitHub();
      window.location.href = url;
    } catch (error) {
      console.error('GitHub connection error:', error);
      toast.error('Failed to connect to GitHub');
      setIsConnecting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Github className="w-5 h-5" />
          <CardTitle className="text-lg">Connect GitHub</CardTitle>
        </div>
        <CardDescription>
          Validate your skills automatically by analyzing your GitHub repositories.
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
                We analyze your code to validate programming languages
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Code2 className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Portfolio Integration</h4>
              <p className="text-xs text-muted-foreground">
                Top repositories added to your profile
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Credibility Score</h4>
              <p className="text-xs text-muted-foreground">
                Build trust through verified contributions
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Activity Tracking</h4>
              <p className="text-xs text-muted-foreground">
                Recent contributions show active development
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
              We only access your public repositories. No private data is accessed.
            </p>
          </div>
        </div>

        {/* Connect Button */}
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
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

        {/* What happens next */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">What happens next:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>You'll be redirected to GitHub to authorize the connection</li>
            <li>We'll analyze your public repositories</li>
            <li>Your skills will be automatically validated and added</li>
            <li>Companies can see your verified technical abilities</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 