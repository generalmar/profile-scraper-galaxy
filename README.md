
# LinkedIn Profile Scraper

This application scrapes LinkedIn profiles and displays the extracted information in a clean, modern interface.

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

4. Set up environment variables by creating a `.env` file in the root directory with:
   ```
   LINKEDIN_USERNAME=your_linkedin_email@example.com
   LINKEDIN_PASSWORD=your_linkedin_password
   ```

5. Start the backend server:
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

## Important Notes

- **LinkedIn Terms of Service**: Scraping LinkedIn may violate their Terms of Service. Use this tool responsibly and for educational purposes only.
- **Rate Limiting**: LinkedIn may rate-limit or block your account if you scrape too many profiles in a short period. Add delays between requests to avoid this.
- **Authentication**: This scraper requires a valid LinkedIn account for authentication. Your credentials are used locally and not stored anywhere else.
