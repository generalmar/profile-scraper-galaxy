
import ProfileScraper from "@/components/ProfileScraper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, LinkedinIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
      <div className="mb-12 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Professional Profile Tools</h1>
        <p className="text-muted-foreground">Choose a tool to get started with your professional profile management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />
              LinkedIn Scraper
            </CardTitle>
            <CardDescription>
              Extract professional information from LinkedIn profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Scrape public LinkedIn profiles to extract information like experience, 
              education, skills, and more without requiring LinkedIn credentials.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/linkedin-scraper" className="w-full">
              <Button className="w-full">
                Go to LinkedIn Scraper
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume Parser
            </CardTitle>
            <CardDescription>
              Extract and format information from PDF resumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload your PDF resume to automatically extract key information
              such as contact details, experience, education, and skills.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/resume-upload" className="w-full">
              <Button className="w-full" variant="outline">
                Go to Resume Parser
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
