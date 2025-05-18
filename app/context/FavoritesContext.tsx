"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  toggleFavorite: () => {},
  isLoading: true,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Load favorites from Supabase on mount and auth changes
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setFavorites(new Set());
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_profiles")
          .select("prayer_favorites")
          .single();

        if (error) throw error;

        setFavorites(new Set(data?.prayer_favorites || []));
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadFavorites();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Save favorites to Supabase whenever they change
  const toggleFavorite = async (id: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If not logged in, prompt to login
    if (!session) {
      // You can customize this behavior
      if (
        window.confirm(
          "Please log in to save favorites. Would you like to log in now?"
        )
      ) {
        router.push("/login");
      }
      return;
    }

    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }

    // Update local state immediately
    setFavorites(newFavorites);

    // Update Supabase
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          prayer_favorites: Array.from(newFavorites),
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving favorites:", error);
      // Revert on error
      setFavorites(favorites);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
