# Vercel Cron Job Setup for Prayer Notifications

## Overview

The prayer notification system uses Vercel Cron Jobs to automatically send emails to users at their preferred times. The cron job runs every minute to check if any users need to receive their notifications.

## Setup Steps

### 1. Set Environment Variables in Vercel

You need to add the following environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

```
CRON_SECRET=<generate-a-secure-random-string>
RESEND_API_KEY=<your-resend-api-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_APP_URL=<your-deployed-app-url>
```

To generate a secure CRON_SECRET, you can use:

```bash
openssl rand -base64 32
```

### 2. Verify vercel.json Configuration

The `vercel.json` file should contain:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-prayer-notifications",
      "schedule": "* * * * *"
    }
  ]
}
```

This runs the cron job every minute.

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Add prayer notification cron job"
git push
```

### 4. Verify Cron Job is Running

After deployment:

1. Go to your Vercel project dashboard
2. Navigate to the Functions tab
3. Look for `/api/cron/send-prayer-notifications`
4. Check the logs to see if it's being triggered

## Testing

### Local Testing

For local testing, the cron authentication is bypassed in development mode. You can test by visiting:

```
http://localhost:3000/api/cron/send-prayer-notifications
```

### Production Testing

To manually trigger the cron job in production (for testing):

```bash
curl -X GET https://your-app.vercel.app/api/cron/send-prayer-notifications \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Troubleshooting

### Cron job not running

1. Check that `vercel.json` is in the root directory
2. Verify the cron schedule syntax is correct
3. Check Vercel Function logs for errors

### Emails not sending

1. Verify RESEND_API_KEY is set correctly
2. Check that the sending domain is verified in Resend
3. Look for errors in the Function logs

### Wrong timing

1. Check user timezone settings
2. Verify the server is using UTC time
3. Test the `shouldSendNotification` logic

## Important Notes

- Cron jobs only work in production (deployed to Vercel)
- The free tier of Vercel allows cron jobs to run at most once per hour
- For every-minute execution, you need Vercel Pro or Enterprise
- All times in the database should be stored in UTC
- User timezone conversion happens in the `shouldSendNotification` function
