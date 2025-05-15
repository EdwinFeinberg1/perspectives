import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PrayerClient from "./PrayerClient";

export default async function PrayerPage() {
  const {
    data: { user },
  } = await supabaseServer().auth.getUser();

  if (!user) {
    redirect("/chat");
  }

  return <PrayerClient />;
}
