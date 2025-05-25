"use client";

import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import EmailNotificationSettings from "@/app/components/Prayer/EmailNotificationSettings";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrayerSettingsPage() {
  return (
    <main className="w-full min-h-screen flex flex-col relative bg-[#0c1320]">
      <Header />
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-8"
        style={{ marginTop: "80px", marginBottom: "80px" }}
      >
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
      </div>
      <Footer />
    </main>
  );
}
