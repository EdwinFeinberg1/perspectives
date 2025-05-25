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

export async function GET(request: NextRequest) {
  console.log("Starting test email notification...");

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
        { error: "Failed to fetch users", details: usersError },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      console.log("No users with email notifications enabled");
      return NextResponse.json({
        message: "No users with email notifications enabled",
      });
    }

    console.log(`Found ${users.length} users with notifications enabled`);

    let successCount = 0;
    let errorCount = 0;
    const results: any[] = [];

    for (const userProfile of users) {
      try {
        // Get user email from auth
        const { data: authUser, error: authError } =
          await supabaseAdmin.auth.admin.getUserById(userProfile.id);

        if (authError || !authUser || !authUser.user.email) {
          console.error(`Could not get email for user ${userProfile.id}`);
          results.push({
            userId: userProfile.id,
            status: "error",
            error: "Could not get user email",
          });
          errorCount++;
          continue;
        }

        const user = {
          ...userProfile,
          email: authUser.user.email,
        };

        // Get favorite prayers
        const favoritePrayers = prayersData.filter((prayer) =>
          user.prayer_favorites?.includes(prayer.id)
        );

        if (favoritePrayers.length === 0) {
          console.log(`User ${user.email} has no favorite prayers`);
          results.push({
            userId: user.id,
            email: user.email,
            status: "skipped",
            reason: "No favorite prayers",
          });
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
          results.push({
            userId: user.id,
            email: user.email,
            status: "success",
            favoritePrayersCount: favoritePrayers.length,
          });
          successCount++;
        } else {
          const error = await response.text();
          console.error(`Failed to send notification to ${user.email}:`, error);
          results.push({
            userId: user.id,
            email: user.email,
            status: "error",
            error: error,
          });
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${userProfile.id}:`, error);
        results.push({
          userId: userProfile.id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        errorCount++;
      }
    }

    console.log(
      `Test email notification completed. Success: ${successCount}, Errors: ${errorCount}`
    );

    return NextResponse.json({
      message: "Test completed",
      success: successCount,
      errors: errorCount,
      total: users.length,
      results: results,
    });
  } catch (error) {
    console.error("Error in test email notification:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
