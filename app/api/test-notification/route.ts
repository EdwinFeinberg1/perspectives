import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    // Get the user ID from query params or use a default
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter required" },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get user email
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser || !authUser.user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 }
      );
    }

    // Force send notification by temporarily clearing last_notification_sent
    const originalLastSent = userProfile.last_notification_sent;

    // Clear last notification sent
    await supabaseAdmin
      .from("user_profiles")
      .update({ last_notification_sent: null })
      .eq("id", userId);

    // Call the send notification endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:3000`;
    const response = await fetch(`${baseUrl}/api/send-prayer-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    return NextResponse.json({
      message: "Test notification sent",
      email: authUser.user.email,
      profile: {
        notification_time: userProfile.notification_time,
        notification_timezone: userProfile.notification_timezone,
        notification_frequency: userProfile.notification_frequency,
        email_notifications_enabled: userProfile.email_notifications_enabled,
        prayer_favorites: userProfile.prayer_favorites,
        original_last_sent: originalLastSent,
      },
      sendResult: result,
    });
  } catch (error) {
    console.error("Error in test notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
