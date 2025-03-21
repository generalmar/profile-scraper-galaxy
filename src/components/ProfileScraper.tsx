
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LinkedInProfile, scrapeLinkedInProfile } from '@/services/linkedinService';
import ProfileDisplay from './ProfileDisplay';
import { ArrowRight, Loader2, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProfileScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUsingMockData(false);
    setIsPublicProfile(false);
    
    if (!url.trim()) {
      toast.error('Please enter a LinkedIn profile URL');
      return;
    }
    
    if (!url.includes('linkedin.com/in/')) {
      setError('Invalid LinkedIn URL. Please enter a URL in the format: https://www.linkedin.com/in/username');
      toast.error('Invalid LinkedIn URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await scrapeLinkedInProfile(url);
      
      if (response.success && response.data) {
        setProfile(response.data);
        // Check if we're using mock data by checking if the name matches one of our demo profiles
        const isMockName = ["John Doe", "Jane Smith"].includes(response.data.name);
        setIsUsingMockData(isMockName);
        
        // Check if this is a public profile with limited data
        if (response.data.publicProfile) {
          setIsPublicProfile(true);
          toast.warning('Limited data available - profile requires LinkedIn login to view fully');
        } else if (isMockName) {
          toast.warning('Using mock data. Connect a real backend to get actual LinkedIn data.');
        } else {
          toast.success('Profile scraped successfully!');
        }
      } else {
        setError(response.error || 'An error occurred while scraping the profile');
        toast.error('Failed to scrape profile');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl mb-2">LinkedIn Profile Scraper</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Extract professional information from LinkedIn profiles with precision and elegance.
        </p>
      </div>
      
      <Alert className="mb-6 max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Backend Required</AlertTitle>
        <AlertDescription>
          This app requires a backend service to scrape LinkedIn profiles. 
          Without it, demo data will be shown. See console for API request details.
        </AlertDescription>
      </Alert>
      
      <Card className="w-full max-w-2xl mx-auto glass-card animate-slide-up">
        <CardHeader>
          <CardTitle>Scrape a Profile</CardTitle>
          <CardDescription>
            Enter a LinkedIn profile URL to extract information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
              <div className="flex gap-2">
                <Input
                  id="linkedin-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className="flex-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Scraping...' : 'Scrape'}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-4">
              <p>Try these sample profile URLs:</p>
              <ul className="list-disc list-inside mt-1">
                <li><span className="text-primary cursor-pointer hover:underline" onClick={() => setUrl('https://www.linkedin.com/in/john-doe')}>https://www.linkedin.com/in/john-doe</span></li>
                <li><span className="text-primary cursor-pointer hover:underline" onClick={() => setUrl('https://www.linkedin.com/in/jane-smith')}>https://www.linkedin.com/in/jane-smith</span></li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {profile && (
        <div className="mt-12 animate-fade-in w-full">
          <Separator className="my-8" />
          {isUsingMockData && (
            <Alert className="mb-6" variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Mock Data</AlertTitle>
              <AlertDescription>
                Displaying mock profile data. Connect to a real backend scraping service to get actual LinkedIn data.
              </AlertDescription>
            </Alert>
          )}
          
          {isPublicProfile && (
            <Alert className="mb-6" variant="warning">
              <Info className="h-4 w-4" />
              <AlertTitle>Limited Public Profile Data</AlertTitle>
              <AlertDescription>
                Only showing limited data available from the public profile. For full profile data, LinkedIn login would be required.
              </AlertDescription>
            </Alert>
          )}
          
          <ProfileDisplay profile={profile} />
        </div>
      )}
    </div>
  );
};

export default ProfileScraper;
