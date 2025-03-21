import { toast } from "sonner";

export interface LinkedInProfile {
  name: string;
  headline: string;
  location: string;
  profileImageUrl: string | null;
  about: string | null;
  experience: Experience[];
  education: Education[];
  skills: string[];
  recommendations: Recommendation[];
  connectionCount: number | null;
  followers: number | null;
  publicProfile?: boolean;
}

export interface Experience {
  title: string;
  company: string;
  dateRange: string;
  location: string | null;
  description: string | null;
}

export interface Education {
  school: string;
  degree: string | null;
  fieldOfStudy: string | null;
  dateRange: string | null;
}

export interface Recommendation {
  author: string;
  relationship: string | null;
  text: string;
}

// Simulated response data for demo purposes (will be used as fallback)
const DEMO_PROFILES = new Map<string, LinkedInProfile>([
  [
    "john-doe",
    {
      name: "John Doe",
      headline: "Software Engineer at Tech Company",
      location: "San Francisco Bay Area",
      profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      about: "Passionate software engineer with 5+ years of experience developing scalable web applications.",
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Company",
          dateRange: "Jan 2020 - Present",
          location: "San Francisco, CA",
          description: "Leading development of microservices architecture using Node.js and React."
        },
        {
          title: "Software Engineer",
          company: "Startup Inc.",
          dateRange: "Jun 2018 - Dec 2019",
          location: "San Francisco, CA",
          description: "Developed and maintained full-stack applications using React and Django."
        }
      ],
      education: [
        {
          school: "University of California, Berkeley",
          degree: "Master of Science",
          fieldOfStudy: "Computer Science",
          dateRange: "2016 - 2018"
        },
        {
          school: "University of Washington",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          dateRange: "2012 - 2016"
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "GraphQL"],
      recommendations: [
        {
          author: "Jane Smith",
          relationship: "Manager at Tech Company",
          text: "John is an exceptional engineer who consistently delivers high-quality code."
        }
      ],
      connectionCount: 500,
      followers: 1200
    }
  ],
  [
    "jane-smith",
    {
      name: "Jane Smith",
      headline: "Product Manager | MBA | Tech Enthusiast",
      location: "New York City",
      profileImageUrl: "https://randomuser.me/api/portraits/women/43.jpg",
      about: "Product manager with a passion for creating user-centered solutions that solve real problems.",
      experience: [
        {
          title: "Senior Product Manager",
          company: "Enterprise Solutions Inc.",
          dateRange: "Mar 2021 - Present",
          location: "New York, NY",
          description: "Leading product strategy and development for enterprise SaaS platform."
        },
        {
          title: "Product Manager",
          company: "Digital Products Co.",
          dateRange: "Feb 2018 - Feb 2021",
          location: "Boston, MA",
          description: "Managed full product lifecycle from conception to launch for mobile applications."
        }
      ],
      education: [
        {
          school: "Harvard Business School",
          degree: "Master of Business Administration",
          fieldOfStudy: "Business Administration",
          dateRange: "2016 - 2018"
        },
        {
          school: "Cornell University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Information Science",
          dateRange: "2012 - 2016"
        }
      ],
      skills: ["Product Strategy", "User Research", "Agile Methodologies", "Data Analysis", "Wireframing", "Product Roadmapping"],
      recommendations: [
        {
          author: "Robert Chen",
          relationship: "CEO at Digital Products Co.",
          text: "Jane is an exceptional product manager who combines analytical skills with strong customer empathy."
        }
      ],
      connectionCount: 873,
      followers: 2450
    }
  ]
]);

/**
 * Extracts the profile identifier from a LinkedIn URL
 */
export const extractProfileId = (url: string): string | null => {
  try {
    // Handle different LinkedIn URL formats
    const profileRegex = /linkedin\.com\/in\/([^/]+)/;
    const match = url.match(profileRegex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// API URL for the LinkedIn scraper backend
const API_URL = import.meta.env.VITE_LINKEDIN_SCRAPER_API_URL || 'http://localhost:3000/api/scrape';

/**
 * Scrapes a LinkedIn profile based on URL by connecting to a backend service
 */
export const scrapeLinkedInProfile = async (profileUrl: string): Promise<{ success: boolean; data?: LinkedInProfile; error?: string }> => {
  try {
    const profileId = extractProfileId(profileUrl);
    
    if (!profileId) {
      return { 
        success: false, 
        error: "Invalid LinkedIn profile URL. Please provide a valid URL (e.g., https://www.linkedin.com/in/username)." 
      };
    }
    
    try {
      // Make an actual API call to your backend scraping service
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: profileUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to scrape profile');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error calling scraping API:", error);
      
      // Fallback to demo data for demonstration purposes
      console.warn("Falling back to demo data");
      const fallbackData = DEMO_PROFILES.get(profileId) || DEMO_PROFILES.get("john-doe");
      
      if (fallbackData) {
        console.log("Using fallback demo data");
        return { 
          success: true, 
          data: fallbackData 
        };
      } else {
        return { 
          success: false, 
          error: "Could not retrieve profile data and no fallback available." 
        };
      }
    }
  } catch (error) {
    console.error("Error scraping LinkedIn profile:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred while processing your request." 
    };
  }
};
