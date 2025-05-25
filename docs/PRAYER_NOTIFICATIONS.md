# Prayer Email Notifications

This feature allows users to receive email notifications containing their favorite prayers at scheduled intervals.

## Features

- **Customizable Schedule**: Users can choose to receive notifications daily, weekly, or monthly
- **Time Preference**: Users can select their preferred time of day to receive notifications
- **Timezone Support**: Notifications are sent according to the user's timezone
- **Beautiful Email Template**: Prayers are formatted in a clean, readable email template
- **Easy Management**: Users can enable/disable notifications and update preferences anytime

## Setup

### 1. Database Migration

Run the following SQL migration to add the necessary columns to your Supabase database:

```sql
-- Add email notification preferences to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS email_notifications_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_frequency text DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS notification_time time DEFAULT '09:00:00',
ADD COLUMN IF NOT EXISTS notification_timezone text DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS last_notification_sent timestamp with time zone;

-- Add constraint for notification_frequency values
ALTER TABLE public.user_profiles
ADD CONSTRAINT notification_frequency_check
CHECK (notification_frequency IN ('daily', 'weekly', 'monthly'));

-- Create notification history table
CREATE TABLE IF NOT EXISTS public.notification_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  prayer_count integer NOT NULL,
  status text NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. Environment Variables

Add the following environment variables:

```env
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=https://your-app-url.com
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Resend Configuration

1. Sign up for a [Resend account](https://resend.com)
2. Verify your domain in Resend
3. Update the "from" email address in `/app/api/send-prayer-notification/route.ts`

## Usage

### For Users

1. Navigate to the Prayer page
2. Click on "Email Notifications" button in the Favorites section
3. Enable notifications and configure preferences:
   - Frequency: Daily, Weekly, or Monthly
   - Time: When to receive the email
   - Timezone: Your local timezone

### For Developers

#### Manual Testing

To manually send a notification to a specific user:

```bash
curl -X POST https://your-app.com/api/send-prayer-notification \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-uuid-here"}'
```

#### Scheduled Notifications

Run the notification script periodically using a cron job or scheduled function:

```bash
# Run the notification sender script
npx tsx scripts/send-prayer-notifications.ts
```

Example cron job (runs every hour):

```cron
0 * * * * cd /path/to/project && npx tsx scripts/send-prayer-notifications.ts
```

## Components

### EmailNotificationSettings Component

- Location: `/app/components/Prayer/EmailNotificationSettings.tsx`
- Allows users to configure their notification preferences
- Integrated with Supabase for real-time updates

### PrayerNotificationEmail Template

- Location: `/app/components/emails/PrayerNotificationEmail.tsx`
- React Email template for beautiful, responsive emails
- Includes all favorited prayers with proper formatting

### API Route

- Location: `/app/api/send-prayer-notification/route.ts`
- Handles sending individual notification emails
- Validates user settings and tracks notification history

### Notification Script

- Location: `/scripts/send-prayer-notifications.ts`
- Batch processes all users with notifications enabled
- Respects user timezone and frequency preferences

## Best Practices

1. **Rate Limiting**: Implement rate limiting on the API route to prevent abuse
2. **Error Handling**: Monitor the notification_history table for failed sends
3. **Unsubscribe**: Include unsubscribe links in emails (handled via settings page)
4. **Testing**: Test with different timezones and frequencies before production deployment

## Troubleshooting

### Emails not sending

1. Check Resend API key is valid
2. Verify domain is configured in Resend
3. Check Supabase service role key has proper permissions
4. Review notification_history table for error messages

### Wrong timing

1. Verify user's timezone is correctly set
2. Check server timezone configuration
3. Ensure cron job is running at appropriate intervals

### Missing prayers

1. Verify user has favorited prayers
2. Check prayer_favorites array in user_profiles table
3. Ensure prayers data is properly imported
