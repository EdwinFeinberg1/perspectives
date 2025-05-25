import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prayers as prayersData } from "@/app/constants/prayers";

// Create a service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
      // Check if it's Monday and hasn't been sent this week
      return userTime.getDay() === 1 && daysSinceLastSent >= 1;
    case "monthly":
      // Check if it's the 1st and hasn't been sent this month
      return userTime.getDate() === 1 && daysSinceLastSent >= 1;
    default:
      return false;
  }
}

export async function GET(request: NextRequest) {
  // Verify this is being called by Vercel Cron
  const authHeader = request.headers.get("authorization");

  // Allow local testing without CRON_SECRET
  if (process.env.NODE_ENV === "development") {
    console.log("Running in development mode - skipping cron authentication");
  } else if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Starting prayer notification cron job...");

  try {
    // Get all users with email notifications enabled
    const { data: users, error: usersError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        "id, prayer_favorites, notification_frequency, notification_time, notification_timezone, last_notification_sent"
      )
      .eq("email_notifications_enabled", true);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      console.log("No users with email notifications enabled");
      return NextResponse.json({ message: "No users to notify" });
    }

    console.log(`Found ${users.length} users with notifications enabled`);

    let successCount = 0;
    let errorCount = 0;

    for (const userProfile of users) {
      try {
        // Get user email from auth
        const { data: authUser, error: authError } =
          await supabaseAdmin.auth.admin.getUserById(userProfile.id);

        if (authError || !authUser || !authUser.user.email) {
          console.error(`Could not get email for user ${userProfile.id}`);
          errorCount++;
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

        // Send email via internal API route
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          `https://${request.headers.get("host")}`;
        const response = await fetch(
          `${baseUrl}/api/send-prayer-notification`,
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
          successCount++;
        } else {
          const error = await response.text();
          console.error(`Failed to send notification to ${user.email}:`, error);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${userProfile.id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `Prayer notification job completed. Success: ${successCount}, Errors: ${errorCount}`
    );

    return NextResponse.json({
      message: "Cron job completed",
      success: successCount,
      errors: errorCount,
      total: users.length,
    });
  } catch (error) {
    console.error("Error in prayer notification cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
