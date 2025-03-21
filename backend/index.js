
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { scrapeLinkedInProfile } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'LinkedIn profile URL is required' 
      });
    }

    console.log(`Scraping LinkedIn profile: ${url}`);
    const profileData = await scrapeLinkedInProfile(url);
    
    if (!profileData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Failed to scrape profile or profile not found' 
      });
    }

    return res.status(200).json(profileData);
  } catch (error) {
    console.error('Error in scrape endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while scraping the profile' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`LinkedIn scraper backend server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/scrape`);
});
