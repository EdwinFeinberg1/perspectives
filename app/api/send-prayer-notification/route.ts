import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { PrayerNotificationEmail } from "@/app/components/emails/PrayerNotificationEmail";
import { prayers as prayersData } from "@/app/constants/prayers";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user profile with email and notification settings
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        "prayer_favorites, email_notifications_enabled, notification_frequency"
      )
      .eq("id", userId)
      .single();

    if (profileError || !userProfile) {
      console.error("Profile error:", profileError);
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    if (!userProfile.email_notifications_enabled) {
      return NextResponse.json(
        { error: "Email notifications are disabled" },
        { status: 400 }
      );
    }

    // Get user email from auth using admin client
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser || !authUser.user.email) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 }
      );
    }

    // Get favorite prayers
    const favoritePrayerIds = userProfile.prayer_favorites || [];
    const favoritePrayers = prayersData.filter((prayer) =>
      favoritePrayerIds.includes(prayer.id)
    );

    if (favoritePrayers.length === 0) {
      return NextResponse.json(
        { error: "No favorite prayers found" },
        { status: 400 }
      );
    }

    // Send email
    const { data, error: sendError } = await resend.emails.send({
      from: "Sephira <notifications@prayers.asksephira.com>",
      to: [authUser.user.email],
      subject: `Your ${userProfile.notification_frequency} Prayer Reminder`,
      react: React.createElement(PrayerNotificationEmail, {
        userName:
          authUser.user.user_metadata?.name ||
          authUser.user.email.split("@")[0],
        prayers: favoritePrayers,
        frequency: userProfile.notification_frequency,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
      }),
    });

    if (sendError) {
      console.error("Error sending email:", sendError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update last notification sent timestamp
    await supabaseAdmin
      .from("user_profiles")
      .update({ last_notification_sent: new Date().toISOString() })
      .eq("id", userId);

    // Log notification history
    await supabaseAdmin.from("notification_history").insert({
      user_id: userId,
      prayer_count: favoritePrayers.length,
      status: "sent",
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in send-prayer-notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
