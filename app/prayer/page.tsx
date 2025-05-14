"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Sparkles } from "lucide-react";

const PrayerPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080d14] text-[#e6d3a3]">
      <Header isPrayerPage={true} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-[120px] pb-[80px] text-center">
        <div className="inline-block p-6 bg-[#121927] rounded-full mb-6 border border-[#e6d3a3]/20 animate-breathing">
          <Sparkles className="h-12 w-12 text-[#e6d3a3]/60" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Prayer Requests Coming Soon
        </h1>
        <p className="text-[#e6d3a3]/70 max-w-md mx-auto text-sm md:text-base">
          Soon you&apos;ll be able to share your prayer intentions with the
          community and receive personalized prayers.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrayerPage;
