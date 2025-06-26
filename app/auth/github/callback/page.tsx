"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, AlertCircle, Github, Code2 } from 'lucide-react';
import { githubService } from '@/lib/services/github';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

export default function GitHubCallbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'analyzing' | 'success' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [validatedSkills, setValidatedSkills] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      if (!user) {
        setError('Please sign in first');
        setStatus('error');
        return;
      }

      try {
        // GitHub OAuth flow is complete, now analyze the profile
        setStatus('analyzing');
        setProgress(25);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev < 90) return prev + 10;
            return prev;
          });
        }, 500);

        // Validate skills from GitHub
        const skills = await githubService.validateSkills();
        setProgress(90);

        // Save to profile
        await githubService.saveToProfile(user.id);
        setProgress(100);

        clearInterval(progressInterval);
        setValidatedSkills(skills);
        setStatus('success');
        
        toast.success(`GitHub analysis complete! Found ${skills.length} validated skills.`);

        // Redirect to profile after 3 seconds
        setTimeout(() => {
          router.push('/profile');
        }, 3000);

      } catch (error) {
        console.error('GitHub callback error:', error);
        setError(error instanceof Error ? error.message : 'Failed to analyze GitHub profile');
        setStatus('error');
      }
    };

    // Small delay to ensure auth state is loaded
    setTimeout(handleCallback, 1000);
  }, [user, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Github className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle>Connecting GitHub</CardTitle>
            <CardDescription>
              Please wait while we establish the connection...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'analyzing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Code2 className="w-12 h-12 text-brand-primary" />
            </div>
            <CardTitle>Analyzing Your Code</CardTitle>
            <CardDescription>
              We're reviewing your repositories to validate your skills...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="text-center text-sm text-muted-foreground">
              {progress < 50 && "Fetching repositories..."}
              {progress >= 50 && progress < 80 && "Analyzing programming languages..."}
              {progress >= 80 && progress < 100 && "Validating skills..."}
              {progress >= 100 && "Saving to your profile..."}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle>GitHub Connected Successfully!</CardTitle>
            <CardDescription>
              We've analyzed your repositories and validated {validatedSkills.length} skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {validatedSkills.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Top Validated Skills</h4>
                <div className="space-y-2">
                  {validatedSkills.slice(0, 5).map((skill) => (
                    <div key={skill.skill} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.confidence}% confidence
                      </span>
                    </div>
                  ))}
                  {validatedSkills.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{validatedSkills.length - 5} more skills
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting you to your profile in a few seconds...
              </p>
              <Button onClick={() => router.push('/profile')} className="w-full">
                Go to Profile Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <CardTitle>Connection Failed</CardTitle>
            <CardDescription>
              {error || 'Something went wrong while connecting to GitHub.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => router.push('/profile')} variant="outline" className="w-full">
              Back to Profile
            </Button>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
} 