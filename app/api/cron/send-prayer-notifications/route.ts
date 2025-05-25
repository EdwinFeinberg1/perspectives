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

  // Get current time in user's timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const timeParts = formatter.formatToParts(now);
  const userHour = parseInt(
    timeParts.find((p) => p.type === "hour")?.value || "0"
  );
  const userMinute = parseInt(
    timeParts.find((p) => p.type === "minute")?.value || "0"
  );

  // Parse user's preferred notification time
  const [prefHour, prefMinute] = user.notification_time.split(":").map(Number);

  console.log(
    `User ${user.email} - Current time in ${userTimezone}: ${userHour}:${userMinute}, Preferred time: ${prefHour}:${prefMinute}`
  );

  // Check if it's within 30 minutes of the preferred time
  const currentMinutes = userHour * 60 + userMinute;
  const preferredMinutes = prefHour * 60 + prefMinute;
  const timeDiff = Math.abs(currentMinutes - preferredMinutes);

  // Handle edge case where preferred time is near midnight
  const timeDiffAcrossMidnight = Math.min(timeDiff, 24 * 60 - timeDiff);

  console.log(`Time difference: ${timeDiffAcrossMidnight} minutes`);

  if (timeDiffAcrossMidnight > 30) {
    console.log(`Not within 30-minute window`);
    return false; // Not the right time
  }

  // Check frequency
  if (!user.last_notification_sent) {
    console.log(`Never sent before - sending notification`);
    return true; // Never sent before
  }

  const lastSent = new Date(user.last_notification_sent);
  const hoursSinceLastSent =
    (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

  console.log(
    `Last sent: ${user.last_notification_sent}, Hours since: ${hoursSinceLastSent}`
  );

  switch (user.notification_frequency) {
    case "daily":
      // For testing, allow if more than 1 hour has passed
      const shouldSendDaily = hoursSinceLastSent >= 1;
      console.log(`Daily frequency - should send: ${shouldSendDaily}`);
      return shouldSendDaily;
    case "weekly":
      // Get day of week in user's timezone
      const dayFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        weekday: "short",
      });
      const dayName = dayFormatter.format(now);
      const dayMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };
      const userDay = dayMap[dayName] ?? 0;
      // Check if it's Monday (1) and enough time has passed
      const shouldSendWeekly = userDay === 1 && hoursSinceLastSent >= 24;
      console.log(
        `Weekly frequency - day: ${dayName} (${userDay}), should send: ${shouldSendWeekly}`
      );
      return shouldSendWeekly;
    case "monthly":
      // Get date in user's timezone
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        day: "numeric",
      });
      const userDate = parseInt(dateFormatter.format(now));
      // Check if it's the 1st and enough time has passed
      const shouldSendMonthly = userDate === 1 && hoursSinceLastSent >= 24;
      console.log(
        `Monthly frequency - date: ${userDate}, should send: ${shouldSendMonthly}`
      );
      return shouldSendMonthly;
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
