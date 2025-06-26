"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle, Github } from 'lucide-react';
import { githubService } from '@/lib/services/github';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      if (!user) {
        // Wait for user to be loaded
        setTimeout(() => handleCallback(), 1000);
        return;
      }

      try {
        // Check if this is a GitHub OAuth callback
        const provider = searchParams.get('provider');
        
        if (provider === 'github') {
          // Analyze GitHub profile and save skills
          const skills = await githubService.validateSkills();
          await githubService.saveToProfile(user.id);
          
          setStatus('success');
          toast.success(`GitHub connected! Found ${skills.length} validated skills.`);
          
          // Redirect to profile
          setTimeout(() => {
            router.push('/profile?tab=github');
          }, 2000);
        } else {
          // Regular auth callback
          setStatus('success');
          router.push('/profile');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [user, router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="w-12 h-12 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-12 h-12 text-green-500" />}
            {status === 'error' && <AlertCircle className="w-12 h-12 text-red-500" />}
          </div>
          <CardTitle>
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we complete the authentication...'}
            {status === 'success' && 'Authentication completed successfully.'}
            {status === 'error' && (error || 'Something went wrong.')}
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent>
            <Button onClick={() => router.push('/profile')} className="w-full">
              Back to Profile
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 