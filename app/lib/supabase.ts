import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { FaithType } from "@/app/types";
// Load environment variables from .env file when running as a script
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
  throw new Error("Supabase credentials are required. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for the perspectives table
export type Perspective = {
  id?: string;
  news_id: string;
  faith: FaithType;
  perspective: string;
  created_at?: string;
};

// Helper function to get perspective
export async function getPerspective(
  newsId: string,
  faith: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("perspectives")
    .select("perspective")
    .eq("news_id", newsId)
    .eq("faith", faith)
    .single();

  if (error || !data) {
    console.error("Error fetching perspective:", error);
    return null;
  }

  return data.perspective;
}
