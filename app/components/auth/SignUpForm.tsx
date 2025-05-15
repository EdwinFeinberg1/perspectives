"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    const { error } = await supabaseBrowser().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-lg font-medium text-[#e6d3a3]">Check your inbox</h2>
        <p className="text-sm text-[#e6d3a3]/70">
          We've sent you a confirmation link. Click it to activate your account.
        </p>
      </div>
    );
  }

  const inputBaseClasses =
    "w-full bg-[#0c1320] text-[#e6d3a3] placeholder:text-[#e6d3a3]/60 border border-[#e6d3a3]/20 rounded-md px-3 py-2 focus:outline-none focus:border-[#e6d3a3]/40 focus:ring-1 focus:ring-[#e6d3a3]/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputBaseClasses}
        />
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputBaseClasses}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-[#e6d3a3]/70 hover:text-[#e6d3a3]"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={inputBaseClasses}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-[#e6d3a3] to-[#d4b978] text-black font-medium py-2 px-4 rounded-md hover:from-[#d4b978] hover:to-[#e6d3a3] transition"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
