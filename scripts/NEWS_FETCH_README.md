# Daily News Fetch Script

This script fetches news articles and religious perspectives once per day, avoiding the issues with Next.js API routes.

## How to Use

Run the script once per day using either of these methods:

### Method 1: NPM Script

```bash
npm run fetch-news
```

### Method 2: Direct Execution

```bash
node scripts/fetch-news.js
```

## Setting Up as a Scheduled Task

### On macOS (using crontab)

1. Open Terminal
2. Run `crontab -e` to edit your cron jobs
3. Add a line to run the script daily at your preferred time (e.g., 6 AM):
   ```
   0 6 * * * cd /path/to/perspectives && /usr/local/bin/node scripts/fetch-news.js >> /path/to/perspectives/logs/news-fetch.log 2>&1
   ```
4. Save and exit

### On Windows (using Task Scheduler)

1. Open Task Scheduler
2. Create a new basic task
3. Set it to run daily
4. Action: Start a program
5. Program/script: `node.exe`
6. Arguments: `scripts/fetch-news.js`
7. Start in: `C:\path\to\perspectives`

## Troubleshooting

- Make sure your `.env` file contains all required API keys:

  - `NEWS_API_KEY`
  - `OPENAI_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- Check logs for any error messages
- Verify Supabase connection and permissions
