# Faith-Lens News Feature

This feature provides real-time news with perspectives from different religious viewpoints, including Rabbi, Pastor, Buddha, and Imam perspectives.

## Setup Instructions

1. **Sign up for API keys**:

   - [NewsAPI](https://newsapi.org/) - For fetching current news headlines
   - [OpenAI](https://platform.openai.com/) - For generating faith perspectives

2. **Add environment variables**:
   Create or update your `.env.local` file with the following variables:

   ```
   # OpenAI API Key for generating faith perspectives
   OPENAI_API_KEY=your_openai_api_key_here

   # News API Key for fetching latest news
   NEWS_API_KEY=your_news_api_key_here
   ```

3. **Install dependencies**:
   The necessary dependencies are already included in the package.json, including:

   - openai - For generating perspectives
   - dayjs - For handling relative time

4. **Restart your development server**:
   ```
   npm run dev
   ```

## Feature Overview

- **Live News Feed**: Fetches current news articles from NewsAPI
- **Faith Perspectives**: Generates unique religious perspectives on each news item
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Save Articles**: Users can save articles for later reading

## Customization

- Modify the API endpoints in `app/api/news/route.ts` to change news sources or categories
- Adjust prompt templates in `app/api/faith-perspective/route.ts` to refine the religious perspectives
- Update the UI styling in `app/components/PersonalitiesSection.tsx`
