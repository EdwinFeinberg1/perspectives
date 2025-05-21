import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: {
            path?: string;
            maxAge?: number;
            domain?: string;
            secure?: boolean;
          }
        ) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle the case where cookies cannot be set (e.g., in middleware)
          }
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          try {
            cookieStore.delete({ name, ...options });
          } catch {
            // Handle the case where cookies cannot be removed
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
