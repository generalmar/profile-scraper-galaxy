
# LinkedIn Profile Scraper

This application scrapes LinkedIn profiles and displays the extracted information in a clean, modern interface. It works with public profiles without requiring LinkedIn login credentials.

## Project Structure

- `src/` - Frontend React application
- `backend/` - Node.js backend for LinkedIn scraping

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Playwright browsers:
   ```
   npx playwright install chromium
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. In the root directory, install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Navigate to the application in your browser
2. Enter a LinkedIn profile URL in the format: `https://www.linkedin.com/in/username`
3. Click "Scrape" to extract the profile information

## Public vs. Private Profiles

- **Public Profiles**: For profiles that are publicly accessible, you'll get basic information like name, headline, and location.
- **Private Profiles**: For profiles that require authentication, you'll see a message indicating limited data availability.

## Important Notes

- **LinkedIn Terms of Service**: Scraping LinkedIn may violate their Terms of Service. Use this tool responsibly and for educational purposes only.
- **Rate Limiting**: LinkedIn may rate-limit or block your IP if you scrape too many profiles in a short period. Add delays between requests to avoid this.
- **Legal Considerations**: Check your local laws regarding web scraping and data collection. Respect user privacy and data protection regulations.
