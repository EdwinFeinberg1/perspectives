"use client";

import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import EmailNotificationSettings from "@/app/components/Prayer/EmailNotificationSettings";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrayerSettingsPage() {
  return (
    <main className="w-full h-screen flex flex-col bg-[#0c1320] overflow-hidden">
      <Header />

      {/* Scrollable content area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          marginTop: "80px",
          WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
          overscrollBehavior: "contain", // Prevent overscroll bounce
        }}
      >
        <div className="flex flex-col items-center justify-start px-4 py-8 min-h-full">
          <div className="w-full max-w-2xl">
            <Link
              href="/prayer"
              className="inline-flex items-center gap-2 text-[#e6d3a3]/70 hover:text-[#e6d3a3] mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Prayers
            </Link>

            <EmailNotificationSettings />
          </div>

          {/* Bottom padding to ensure content is accessible above the footer */}
          <div
            className="w-full h-20"
            style={{ height: "calc(5rem + env(safe-area-inset-bottom))" }}
          ></div>
        </div>
      </div>

      {/* Fixed footer with safe area padding */}
      <div
        className="bg-[#0c1320] border-t border-[#e6d3a3]/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Footer />
      </div>
    </main>
  );
}
