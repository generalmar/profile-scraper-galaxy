
const { chromium } = require('playwright');

// Helper to extract text content safely
const extractText = async (page, selector) => {
  try {
    return await page.$eval(selector, el => el.textContent.trim());
  } catch (error) {
    return null;
  }
};

// Helper to extract multiple elements
const extractMultiple = async (page, selector, extractor) => {
  try {
    return await page.$$eval(selector, (elements, extractor) => {
      return elements.map(el => {
        // Convert the extractor function from string to function
        const extractorFn = new Function('el', `return ${extractor}`);
        return extractorFn(el);
      });
    }, extractor.toString());
  } catch (error) {
    console.error(`Error extracting multiple elements with selector ${selector}:`, error);
    return [];
  }
};

const scrapeLinkedInProfile = async (profileUrl) => {
  const browser = await chromium.launch({
    headless: true, // Set to false for debugging
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`Navigating to profile: ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    
    // Check if we're on a public profile page
    const currentUrl = page.url();
    if (currentUrl.includes('linkedin.com/login') || currentUrl.includes('authwall')) {
      console.log('Profile requires authentication. Using limited public data extraction.');
      
      // Try to extract basic information still visible on public profiles
      const name = await extractText(page, 'h1.top-card-layout__title');
      const headline = await extractText(page, 'h2.top-card-layout__headline');
      const location = await extractText(page, '.top-card-layout__card .top-card__subline-item');
      
      let profileImageUrl = null;
      try {
        profileImageUrl = await page.$eval('.top-card-layout__card .profile-photo img', img => img.src);
      } catch (error) {
        // Profile image might not be available
      }
      
      // Return limited data for public viewing
      return {
        name,
        headline,
        location,
        profileImageUrl,
        about: null,
        experience: [],
        education: [],
        skills: [],
        recommendations: [],
        connectionCount: null,
        followers: null,
        publicProfile: true
      };
    }
    
    // Extract basic profile information
    const name = await extractText(page, 'h1.text-heading-xlarge');
    const headline = await extractText(page, '.text-body-medium.break-words');
    const location = await extractText(page, '.text-body-small.inline.t-black--light.break-words');
    
    // Extract profile image URL
    let profileImageUrl = null;
    try {
      profileImageUrl = await page.$eval('.pv-top-card-profile-picture__image', img => img.src);
    } catch (error) {
      // Profile image might not be available
    }
    
    // Extract about section
    let about = null;
    try {
      // Click "see more" button if it exists
      const aboutSeeMoreButton = await page.$('div#about + div + div button.inline-show-more-text__button');
      if (aboutSeeMoreButton) {
        await aboutSeeMoreButton.click();
      }
      about = await extractText(page, 'div#about + div + div span.visually-hidden');
    } catch (error) {
      // About section might not be available
    }
    
    // Extract experience
    const experience = await extractMultiple(
      page, 
      'li.artdeco-list__item.pvs-list__item--line-separated', 
      `(el) => {
        const titleEl = el.querySelector('.t-bold span');
        const companyEl = el.querySelector('.t-normal span');
        const dateRangeEl = el.querySelector('.t-normal.t-black--light span');
        const locationEl = el.querySelector('.t-normal.t-black--light span:nth-child(2)');
        const descriptionEl = el.querySelector('.pvs-list__outer-container .pvs-list__item--line-separated .visually-hidden');
        
        if (!titleEl || !companyEl) return null;
        
        return {
          title: titleEl.textContent.trim(),
          company: companyEl.textContent.trim(),
          dateRange: dateRangeEl ? dateRangeEl.textContent.trim() : null,
          location: locationEl ? locationEl.textContent.trim() : null,
          description: descriptionEl ? descriptionEl.textContent.trim() : null
        };
      }`
    );
    
    // Filter out null values from experience
    const filteredExperience = experience.filter(exp => exp !== null);
    
    // Extract education
    const education = await extractMultiple(
      page, 
      'section#education-section li', 
      `(el) => {
        const schoolEl = el.querySelector('.t-bold span');
        const degreeEl = el.querySelector('.t-normal span');
        const fieldOfStudyEl = el.querySelector('.t-normal span:nth-child(2)');
        const dateRangeEl = el.querySelector('.t-normal.t-black--light span');
        
        if (!schoolEl) return null;
        
        return {
          school: schoolEl.textContent.trim(),
          degree: degreeEl ? degreeEl.textContent.trim() : null,
          fieldOfStudy: fieldOfStudyEl ? fieldOfStudyEl.textContent.trim() : null,
          dateRange: dateRangeEl ? dateRangeEl.textContent.trim() : null
        };
      }`
    );
    
    // Filter out null values from education
    const filteredEducation = education.filter(edu => edu !== null);
    
    // Extract skills
    let skills = [];
    try {
      await page.click('a[href="#skills"]');
      await page.waitForSelector('.pvs-entity');
      
      skills = await extractMultiple(
        page,
        'section#skills ~ section .pvs-entity .pv-skill-category-entity__name-text',
        '(el) => el.textContent.trim()'
      );
    } catch (error) {
      console.log('Could not extract skills:', error.message);
    }
    
    // Extract recommendations
    let recommendations = [];
    try {
      await page.click('a[href="#recommendations"]');
      await page.waitForSelector('.pvs-entity');
      
      recommendations = await extractMultiple(
        page,
        'section#recommendations ~ section .pvs-entity',
        `(el) => {
          const authorEl = el.querySelector('.t-bold span');
          const relationshipEl = el.querySelector('.t-normal span');
          const textEl = el.querySelector('.pvs-list__outer-container .visually-hidden');
          
          if (!authorEl || !textEl) return null;
          
          return {
            author: authorEl.textContent.trim(),
            relationship: relationshipEl ? relationshipEl.textContent.trim() : null,
            text: textEl.textContent.trim()
          };
        }`
      );
      
      // Filter out null values from recommendations
      recommendations = recommendations.filter(rec => rec !== null);
    } catch (error) {
      console.log('Could not extract recommendations:', error.message);
    }
    
    // Extract connection count and followers
    let connectionCount = null;
    let followers = null;
    
    try {
      const connectionsText = await extractText(page, '.pv-top-card--list span.t-bold');
      if (connectionsText) {
        const connections = connectionsText.match(/(\d+)/);
        if (connections && connections[1]) {
          connectionCount = parseInt(connections[1], 10);
        }
      }
      
      const followersText = await extractText(page, '.pvs-list__item--with-border span.t-bold');
      if (followersText) {
        const followersMatch = followersText.match(/(\d+)/);
        if (followersMatch && followersMatch[1]) {
          followers = parseInt(followersMatch[1], 10);
        }
      }
    } catch (error) {
      console.log('Could not extract connection count or followers:', error.message);
    }
    
    // Compile the profile data
    const profileData = {
      name,
      headline,
      location,
      profileImageUrl,
      about,
      experience: filteredExperience,
      education: filteredEducation,
      skills,
      recommendations,
      connectionCount,
      followers,
      publicProfile: false
    };
    
    return profileData;
  } catch (error) {
    console.error('Error scraping LinkedIn profile:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeLinkedInProfile
};
