
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { extractTextFromPdf } from '@/services/pdfService';
import ResumeDisplay from '@/components/ResumeDisplay';

interface ResumeData {
  rawText: string;
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: { title: string; company: string; date: string; description: string }[];
  education: { school: string; degree: string; date: string }[];
}

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        toast.error('Invalid file type. Please upload a PDF file.');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const text = await extractTextFromPdf(file);
      const parsedData = parseResumeData(text);
      setResumeData(parsedData);
      toast.success('Resume successfully processed!');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError('Failed to process the PDF file. Please try again with a different file.');
      toast.error('Failed to process the PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple parser to extract information from resume text
  const parseResumeData = (text: string): ResumeData => {
    // This is a simple parsing logic that can be improved with better algorithms or AI
    const lines = text.split('\n').filter(line => line.trim());
    
    // Basic extraction (can be enhanced with regex or more sophisticated parsing)
    const name = lines[0]?.trim() || 'Unknown';
    
    // Try to extract email using regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : undefined;
    
    // Try to extract phone using regex
    const phoneRegex = /(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const phoneMatch = text.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : undefined;
    
    // Extract skills (looking for common headers)
    const skillsSection = extractSection(text, ['SKILLS', 'TECHNICAL SKILLS', 'TECHNOLOGIES']);
    const skills = skillsSection
      ? skillsSection
          .split(/[,;•]/)
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0 && skill.length < 30)
      : [];
    
    // Extract experience
    const experienceSection = extractSection(text, ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT']);
    const experience = experienceSection 
      ? parseExperienceSection(experienceSection)
      : [];
    
    // Extract education
    const educationSection = extractSection(text, ['EDUCATION', 'ACADEMIC']);
    const education = educationSection
      ? parseEducationSection(educationSection)
      : [];
    
    return {
      rawText: text,
      name,
      email,
      phone,
      skills,
      experience,
      education
    };
  };
  
  // Helper to extract a section from the text
  const extractSection = (text: string, possibleHeaders: string[]): string | null => {
    let sectionText = null;
    
    for (const header of possibleHeaders) {
      const regex = new RegExp(`${header}[:\\s]*(.*?)(?:\\n\\s*\\n|$|(?=\\n[A-Z]{2,}))`, 'is');
      const match = text.match(regex);
      
      if (match && match[1]) {
        sectionText = match[1].trim();
        break;
      }
    }
    
    return sectionText;
  };
  
  // Parse experience section into structured data
  const parseExperienceSection = (sectionText: string) => {
    // This is a simple parser and would need to be enhanced for better accuracy
    const experiences = [];
    const experienceBlocks = sectionText.split(/\n\s*\n/);
    
    for (const block of experienceBlocks) {
      if (block.trim()) {
        const lines = block.split('\n').map(line => line.trim());
        
        if (lines.length >= 2) {
          // Try to extract company and title
          const firstLineParts = lines[0].split('-').map(part => part.trim());
          const company = firstLineParts[0] || 'Unknown Company';
          const title = firstLineParts.length > 1 ? firstLineParts[1] : lines[1];
          
          // Try to extract date
          const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+(-|to|–|—)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{4}\s+(-|to|–|—)\s+\d{4}|\d{4}\s+(-|to|–|—)\s+Present\b/i;
          
          const dateMatch = block.match(dateRegex);
          const date = dateMatch ? dateMatch[0] : 'Unknown Date';
          
          // Remaining text is the description
          const description = lines.slice(2).join(' ');
          
          experiences.push({
            company,
            title,
            date,
            description
          });
        }
      }
    }
    
    return experiences;
  };
  
  // Parse education section into structured data
  const parseEducationSection = (sectionText: string) => {
    const education = [];
    const educationBlocks = sectionText.split(/\n\s*\n/);
    
    for (const block of educationBlocks) {
      if (block.trim()) {
        const lines = block.split('\n').map(line => line.trim());
        
        if (lines.length >= 1) {
          const school = lines[0];
          const degreeMatch = block.match(/Bachelor|Master|Associate|Ph\.D|MBA|BS|BA|MS|MA/i);
          const degree = degreeMatch ? block.substring(degreeMatch.index).split('\n')[0].trim() : 'Degree not specified';
          
          const dateRegex = /\b\d{4}\b/g;
          const dates = block.match(dateRegex);
          const date = dates ? dates.join('-') : '';
          
          education.push({
            school,
            degree,
            date
          });
        }
      }
    }
    
    return education;
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl mb-2">Resume Parser</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload a PDF resume and extract detailed information automatically.
        </p>
      </div>
      
      <Alert className="mb-6 max-w-2xl mx-auto">
        <FileText className="h-4 w-4" />
        <AlertTitle>PDF Support</AlertTitle>
        <AlertDescription>
          This tool works best with simple, text-based PDF resumes. Complex layouts or scanned documents may result in less accurate extraction.
        </AlertDescription>
      </Alert>
      
      <Card className="w-full max-w-2xl mx-auto glass-card animate-slide-up">
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>
            Upload a PDF resume to extract information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-upload">Resume PDF</Label>
              <div className="flex flex-col gap-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => document.getElementById('resume-upload')?.click()}>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {file ? file.name : 'Click to select or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF files only, max 10MB
                  </p>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isLoading}
                  className="transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Processing...' : 'Extract Resume Data'}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {resumeData && (
        <div className="mt-12 animate-fade-in w-full">
          <Separator className="my-8" />
          <ResumeDisplay resumeData={resumeData} />
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
