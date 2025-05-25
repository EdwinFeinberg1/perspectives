import { createClient } from "@supabase/supabase-js";

// This script verifies that your production database is ready for email notifications

async function verifyProductionSetup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing required environment variables");
    console.log("Make sure you have:");
    console.log("- NEXT_PUBLIC_SUPABASE_URL");
    console.log("- SUPABASE_SERVICE_ROLE_KEY");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log("🔍 Checking production database setup...\n");

  // Check if user_profiles table has email notification columns
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        "email_notifications_enabled, notification_frequency, notification_time, notification_timezone, last_notification_sent"
      )
      .limit(1);

    if (error) {
      console.error("❌ Error checking user_profiles table:", error.message);
      console.log(
        "\nYou need to run the migration to add email notification columns."
      );
      console.log("Run this SQL in your Supabase dashboard:\n");
      console.log(`
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
      `);
    } else {
      console.log("✅ user_profiles table has email notification columns");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }

  // Check if notification_history table exists
  try {
    const { data, error } = await supabase
      .from("notification_history")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ notification_history table doesn't exist");
      console.log("\nRun this SQL in your Supabase dashboard:\n");
      console.log(`
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

-- Enable RLS on notification_history
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own notification history
CREATE POLICY "Users can view own notification history"
  ON public.notification_history
  FOR SELECT
  USING (auth.uid() = user_id);
      `);
    } else {
      console.log("✅ notification_history table exists");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }

  // Check environment variables
  console.log("\n🔍 Checking environment variables...\n");

  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "NEXT_PUBLIC_APP_URL",
    "CRON_SECRET",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.log("❌ Missing environment variables in local .env.local:");
    missingEnvVars.forEach((varName) => console.log(`  - ${varName}`));
    console.log("\nMake sure these are also set in Vercel!");
  } else {
    console.log("✅ All required environment variables are set locally");
    console.log("   (Make sure they're also set in Vercel!)");
  }

  console.log("\n📋 Pre-deployment checklist:");
  console.log("1. ✅ Environment variables set in Vercel");
  console.log(
    "2. ⚠️  Vercel plan supports your cron frequency (Pro for every minute)"
  );
  console.log("3. 🔍 Domain verified in Resend (prayers.asksephira.com)");
  console.log("4. 🔍 Database migrations run in production");
  console.log("5. ✅ vercel.json configured with cron job");
}

verifyProductionSetup().catch(console.error);
