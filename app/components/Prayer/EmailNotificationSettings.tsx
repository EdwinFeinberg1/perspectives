"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Clock, Calendar, Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/app/context/FavoritesContext";

interface NotificationSettings {
  email_notifications_enabled: boolean;
  notification_frequency: "daily" | "weekly" | "monthly";
  notification_time: string;
  notification_timezone: string;
}

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "UTC", label: "UTC" },
];

export default function EmailNotificationSettings() {
  const router = useRouter();
  const supabase = createClient();
  const { favorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications_enabled: false,
    notification_frequency: "daily",
    notification_time: "09:00",
    notification_timezone: "America/New_York",
  });
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserEmail(session.user.email || null);

      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          "email_notifications_enabled, notification_frequency, notification_time, notification_timezone"
        )
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          email_notifications_enabled:
            data.email_notifications_enabled || false,
          notification_frequency: data.notification_frequency || "daily",
          notification_time: data.notification_time
            ? data.notification_time.slice(0, 5)
            : "09:00",
          notification_timezone:
            data.notification_timezone || "America/New_York",
        });
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("user_profiles")
        .update({
          email_notifications_enabled: settings.email_notifications_enabled,
          notification_frequency: settings.notification_frequency,
          notification_time: settings.notification_time + ":00",
          notification_timezone: settings.notification_timezone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      // Show success message
      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, email_notifications_enabled: checked }));
  };

  const handleFrequencyChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      notification_frequency: value as "daily" | "weekly" | "monthly",
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, notification_time: e.target.value }));
  };

  const handleTimezoneChange = (value: string) => {
    setSettings((prev) => ({ ...prev, notification_timezone: value }));
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </CardContent>
      </Card>
    );
  }

  const favoritesCount = favorites.size;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bell className="h-5 w-5" />
          Prayer Email Notifications
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Get daily reminders of your favorite prayers delivered to your inbox
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Display */}
        <div className="text-sm text-muted-foreground">
          Notifications will be sent to:{" "}
          <span className="font-medium text-foreground">{userEmail}</span>
        </div>

        {/* Favorites Count */}
        <div className="bg-muted p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-foreground">
              {favoritesCount}
            </span>{" "}
            favorited prayer{favoritesCount !== 1 ? "s" : ""} that will be
            included in your notifications.
          </p>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-enabled" className="text-foreground">
              Enable Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive your favorite prayers via email
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={settings.email_notifications_enabled}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Settings (only show when enabled) */}
        {settings.email_notifications_enabled && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Frequency */}
            <div className="space-y-2">
              <Label
                htmlFor="frequency"
                className="flex items-center gap-2 text-foreground"
              >
                <Calendar className="h-4 w-4" />
                Frequency
              </Label>
              <Select
                value={settings.notification_frequency}
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger
                  id="frequency"
                  className="bg-card border-border text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="daily" className="text-popover-foreground">
                    Daily
                  </SelectItem>
                  <SelectItem
                    value="weekly"
                    className="text-popover-foreground"
                  >
                    Weekly (Every Monday)
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    className="text-popover-foreground"
                  >
                    Monthly (1st of each month)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label
                htmlFor="time"
                className="flex items-center gap-2 text-foreground"
              >
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={settings.notification_time}
                onChange={handleTimeChange}
                className="bg-card border-border text-foreground"
              />
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label
                htmlFor="timezone"
                className="flex items-center gap-2 text-foreground"
              >
                <Globe className="h-4 w-4" />
                Timezone
              </Label>
              <Select
                value={settings.notification_timezone}
                onValueChange={handleTimezoneChange}
              >
                <SelectTrigger
                  id="timezone"
                  className="bg-card border-border text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {TIMEZONES.map((tz) => (
                    <SelectItem
                      key={tz.value}
                      value={tz.value}
                      className="text-popover-foreground"
                    >
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
