"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "./Header";
import { User } from "@supabase/supabase-js";

interface ClientHeaderProps {
  isPrayerPage?: boolean;
  prayerSearch?: string;
  onPrayerSearch?: (search: string) => void;
  selectedCategories?: Set<string>;
  togglePrayerCategory?: (cat: string) => void;
  counts?: Record<string, number>;
}

export default function ClientHeader(props: ClientHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Header user={user} {...props} />;
}
