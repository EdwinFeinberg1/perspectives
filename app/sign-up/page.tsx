"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SignUpForm from "../components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="w-full min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-1 flex items-center justify-center pt-28 pb-10 px-4">
        <div className="w-full max-w-md bg-[#0c1320] border border-[#e6d3a3]/20 rounded-xl p-6 shadow-lg">
          <h1 className="text-center text-xl font-semibold text-[#e6d3a3] mb-4">
            Create your account
          </h1>
          <SignUpForm />
        </div>
      </div>
      <Footer />
    </main>
  );
}
