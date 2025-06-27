"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Share2, 
  Copy, 
  Twitter, 
  Linkedin,
  Check,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/use-auth';
import { activityTrackingService } from '@/lib/services/activity-tracking';

export function SocialCardGenerator() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardUrl, setCardUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateCard = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const url = `/api/developer-card?userId=${user.id}`;
      setCardUrl(url);
      toast.success('Card generated successfully!');
    } catch (error) {
      toast.error('Failed to generate card');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCard = async () => {
    if (!cardUrl) return;
    
    try {
      const response = await fetch(cardUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.name?.replace(/\s+/g, '-')}-chosn-developer-card.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Track download
      await activityTrackingService.trackSocialCardShare('download');
      
      toast.success('Card downloaded!');
    } catch (error) {
      toast.error('Failed to download card');
    }
  };

  const copyLink = async () => {
    const profileUrl = `${window.location.origin}/developers/${user?.id}`;
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Track link copy
    await activityTrackingService.trackSocialCardShare('link_copy');
    
    toast.success('Profile link copied!');
  };

  const shareOnTwitter = async () => {
    const text = `Check out my verified developer profile on @ChosnDev! 🚀\n\nI've got ${user?.role === 'developer' ? 'GitHub-validated skills' : 'a professional profile'} and I'm open to new opportunities.\n\n`;
    const url = `${window.location.origin}/developers/${user?.id}`;
    
    // Track Twitter share
    await activityTrackingService.trackSocialCardShare('twitter', window.location.href);
    
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = async () => {
    const url = `${window.location.origin}/developers/${user?.id}`;
    
    // Track LinkedIn share
    await activityTrackingService.trackSocialCardShare('linkedin', window.location.href);
    
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-primary" />
          Developer Social Card
        </CardTitle>
        <CardDescription>
          Generate a beautiful card to showcase your skills on social media
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Preview */}
          {cardUrl && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 blur-xl group-hover:blur-2xl transition-all" />
              <img 
                src={cardUrl} 
                alt="Developer Card Preview"
                className="relative w-full rounded-lg shadow-2xl"
              />
            </div>
          )}

          {/* Generate Button */}
          {!cardUrl && (
            <Button 
              onClick={generateCard}
              disabled={isGenerating}
              size="lg"
              className="w-full gradient-bg"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate My Card
                </>
              )}
            </Button>
          )}

          {/* Action Buttons */}
          {cardUrl && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={downloadCard}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={copyLink}
                variant="outline"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Social Share */}
          {cardUrl && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Share your card on social media
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={shareOnTwitter}
                  size="lg"
                  className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  onClick={shareOnLinkedIn}
                  size="lg"
                  className="flex-1 bg-[#0077B5] hover:bg-[#006399] text-white"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Why share your card?</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Showcase GitHub-validated skills</li>
              <li>• Stand out with verified credentials</li>
              <li>• Get discovered by top companies</li>
              <li>• Build your professional brand</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 