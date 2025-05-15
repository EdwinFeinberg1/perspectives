import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Function to create a client or return a mock client if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
    
    // Return a mock client that won't throw errors
    return {
      from: () => ({
        insert: () => Promise.resolve({ error: null, data: null }),
        select: () => Promise.resolve({ error: null, data: [] }),
        update: () => Promise.resolve({ error: null, data: null }),
        delete: () => Promise.resolve({ error: null, data: null }),
      }),
      auth: {
        signIn: () => Promise.resolve({ error: null, data: null }),
        signOut: () => Promise.resolve({ error: null, data: null }),
      },
    };
  }
  
  try {
    // Return the real Supabase client
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    
    // Return the mock client on error
    return {
      from: () => ({
        insert: () => Promise.resolve({ error: null, data: null }),
        select: () => Promise.resolve({ error: null, data: [] }),
        update: () => Promise.resolve({ error: null, data: null }),
        delete: () => Promise.resolve({ error: null, data: null }),
      }),
      auth: {
        signIn: () => Promise.resolve({ error: null, data: null }),
        signOut: () => Promise.resolve({ error: null, data: null }),
      },
    };
  }
};

export const supabase = createSupabaseClient();
