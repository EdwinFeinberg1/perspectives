import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { prayers as prayersData } from "../app/constants/prayers";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;

if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

interface UserNotificationData {
  id: string;
  email: string;
  prayer_favorites: string[];
  notification_frequency: "daily" | "weekly" | "monthly";
  notification_time: string;
  notification_timezone: string;
  last_notification_sent: string | null;
}

async function shouldSendNotification(
  user: UserNotificationData
): Promise<boolean> {
  const now = new Date();
  const userTimezone = user.notification_timezone || "UTC";

  // Convert current time to user's timezone
  const userTime = new Date(
    now.toLocaleString("en-US", { timeZone: userTimezone })
  );
  const userHour = userTime.getHours();
  const userMinute = userTime.getMinutes();

  // Parse user's preferred notification time
  const [prefHour, prefMinute] = user.notification_time.split(":").map(Number);

  // Check if it's within 30 minutes of the preferred time
  const currentMinutes = userHour * 60 + userMinute;
  const preferredMinutes = prefHour * 60 + prefMinute;
  const timeDiff = Math.abs(currentMinutes - preferredMinutes);

  if (timeDiff > 30 && timeDiff < 24 * 60 - 30) {
    return false; // Not the right time
  }

  // Check frequency
  if (!user.last_notification_sent) {
    return true; // Never sent before
  }

  const lastSent = new Date(user.last_notification_sent);
  const daysSinceLastSent =
    (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);

  switch (user.notification_frequency) {
    case "daily":
      return daysSinceLastSent >= 1;
    case "weekly":
      return daysSinceLastSent >= 7;
    case "monthly":
      return daysSinceLastSent >= 30;
    default:
      return false;
  }
}

async function sendPrayerNotifications() {
  console.log("Starting prayer notification job...");

  try {
    // Get all users with email notifications enabled
    const { data: users, error: usersError } = await supabase
      .from("user_profiles")
      .select(
        "id, prayer_favorites, notification_frequency, notification_time, notification_timezone, last_notification_sent"
      )
      .eq("email_notifications_enabled", true);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log("No users with email notifications enabled");
      return;
    }

    console.log(`Found ${users.length} users with notifications enabled`);

    for (const userProfile of users) {
      try {
        // Get user email from auth
        const { data: authUser, error: authError } =
          await supabase.auth.admin.getUserById(userProfile.id);

        if (authError || !authUser || !authUser.user.email) {
          console.error(`Could not get email for user ${userProfile.id}`);
          continue;
        }

        const user: UserNotificationData = {
          ...userProfile,
          email: authUser.user.email,
        };

        // Check if we should send notification
        if (!(await shouldSendNotification(user))) {
          console.log(
            `Skipping notification for ${user.email} - not the right time or frequency`
          );
          continue;
        }

        // Get favorite prayers
        const favoritePrayers = prayersData.filter((prayer) =>
          user.prayer_favorites?.includes(prayer.id)
        );

        if (favoritePrayers.length === 0) {
          console.log(`User ${user.email} has no favorite prayers`);
          continue;
        }

        // Send email via API route (to reuse the email template)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/send-prayer-notification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          }
        );

        if (response.ok) {
          console.log(`Successfully sent notification to ${user.email}`);
        } else {
          const error = await response.text();
          console.error(`Failed to send notification to ${user.email}:`, error);
        }
      } catch (error) {
        console.error(`Error processing user ${userProfile.id}:`, error);
      }
    }

    console.log("Prayer notification job completed");
  } catch (error) {
    console.error("Error in prayer notification job:", error);
  }
}

// Run the job
sendPrayerNotifications();
