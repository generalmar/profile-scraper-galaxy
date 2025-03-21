
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, GraduationCap, Mail, Phone, User, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeData {
  rawText: string;
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: { title: string; company: string; date: string; description: string }[];
  education: { school: string; degree: string; date: string }[];
}

interface ResumeDisplayProps {
  resumeData: ResumeData;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight">Resume Information</h2>
        <p className="text-muted-foreground">Extracted data from your PDF resume</p>
      </div>
      
      <Tabs defaultValue="formatted" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="formatted">Formatted Resume</TabsTrigger>
          <TabsTrigger value="raw">Raw Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="formatted">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full h-24 w-24 bg-muted flex items-center justify-center text-2xl font-medium text-primary border-4 border-background shadow-md mb-4">
                  {resumeData.name ? resumeData.name.split(' ').map(name => name[0]).join('') : '?'}
                </div>
                <h3 className="text-2xl font-bold">{resumeData.name || 'Unknown Name'}</h3>
                
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {resumeData.email && (
                    <div className="flex items-center gap-1 text-sm bg-background/80 px-3 py-1 rounded-full">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{resumeData.email}</span>
                    </div>
                  )}
                  
                  {resumeData.phone && (
                    <div className="flex items-center gap-1 text-sm bg-background/80 px-3 py-1 rounded-full">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{resumeData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-primary" />
                      Experience
                    </h4>
                    {resumeData.experience.length > 0 ? (
                      <div className="space-y-4">
                        {resumeData.experience.map((exp, index) => (
                          <div key={index} className="relative pl-4 border-l-2 border-muted">
                            <h5 className="font-medium">{exp.title}</h5>
                            <p className="text-sm font-medium text-primary">{exp.company}</p>
                            <p className="text-xs text-muted-foreground">{exp.date}</p>
                            {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No experience information extracted</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                      Education
                    </h4>
                    {resumeData.education.length > 0 ? (
                      <div className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="relative pl-4 border-l-2 border-muted">
                            <h5 className="font-medium">{edu.school}</h5>
                            <p className="text-sm">{edu.degree}</p>
                            {edu.date && <p className="text-xs text-muted-foreground">{edu.date}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No education information extracted</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-primary" />
                      Skills
                    </h4>
                    {resumeData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="rounded-full py-1 px-3">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No skills information extracted</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle>Raw Text Content</CardTitle>
              <CardDescription>
                Unprocessed text extracted from the PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md max-h-[500px] overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">{resumeData.rawText}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-xs text-muted-foreground">
        <p>Note: This is a basic resume parser. For more accurate results, consider using specialized resume parsing services.</p>
      </div>
    </div>
  );
};

export default ResumeDisplay;
