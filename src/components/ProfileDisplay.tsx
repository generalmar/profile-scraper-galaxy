
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkedInProfile } from '@/services/linkedinService';
import { Briefcase, GraduationCap, MapPin, MessageSquareQuote, Star } from 'lucide-react';

interface ProfileDisplayProps {
  profile: LinkedInProfile;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight">Profile Information</h2>
        <p className="text-muted-foreground">Details extracted from the LinkedIn profile</p>
      </div>
      
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {profile.profileImageUrl ? (
              <img 
                src={profile.profileImageUrl} 
                alt={profile.name} 
                className="rounded-full h-24 w-24 object-cover border-4 border-background shadow-md"
              />
            ) : (
              <div className="rounded-full h-24 w-24 bg-muted flex items-center justify-center text-2xl font-medium text-muted-foreground border-4 border-background shadow-md">
                {profile.name.split(' ').map(name => name[0]).join('')}
              </div>
            )}
            
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="text-lg text-muted-foreground">{profile.headline}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
                {profile.connectionCount && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground mx-1"></span>
                    <span>{profile.connectionCount}+ connections</span>
                  </>
                )}
                {profile.followers && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground mx-1"></span>
                    <span>{profile.followers} followers</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          {profile.about && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2">About</h4>
              <p className="text-muted-foreground whitespace-pre-line">{profile.about}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Experience
                </h4>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-muted">
                      <h5 className="font-medium">{exp.title}</h5>
                      <p className="text-sm font-medium text-primary">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.dateRange}</p>
                      {exp.location && <p className="text-xs text-muted-foreground mt-1">{exp.location}</p>}
                      {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              {profile.recommendations.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-4 flex items-center">
                    <MessageSquareQuote className="h-5 w-5 mr-2 text-primary" />
                    Recommendations
                  </h4>
                  <div className="space-y-4">
                    {profile.recommendations.map((rec, index) => (
                      <Card key={index} className="bg-accent/50 border-none">
                        <CardContent className="p-4">
                          <p className="italic text-sm">"{rec.text}"</p>
                          <div className="mt-2 text-xs font-medium">
                            <span>{rec.author}</span>
                            {rec.relationship && (
                              <span className="text-muted-foreground"> · {rec.relationship}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Education
                </h4>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-muted">
                      <h5 className="font-medium">{edu.school}</h5>
                      {edu.degree && <p className="text-sm">{edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</p>}
                      {edu.dateRange && <p className="text-xs text-muted-foreground">{edu.dateRange}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground">
        <p>Note: This is a demonstration with simulated data. In a production environment, this would connect to a backend service that handles the actual scraping.</p>
      </div>
    </div>
  );
};

export default ProfileDisplay;
