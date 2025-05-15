import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
  // Complete the auth flow and set cookies / session
  await supabaseServer().auth.exchangeCodeForSession();

  // Redirect to the dashboard (adjust as needed)
  redirect("/dashboard");
}
