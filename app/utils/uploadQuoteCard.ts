// uploadQuoteCard.ts

import { supabase } from "@/lib/supabase";
import { dataUrlToBlob } from "./dataUrlToBlob";

export const uploadQuoteCard = async (dataUrl: string, filename: string) => {
  const blob = dataUrlToBlob(dataUrl);

  const filePath = `quote-cards/${filename}`;
  const { error } = await supabase.storage
    .from("quote-cards") // create this bucket in the Dashboard
    .upload(filePath, blob, { upsert: true, contentType: "image/png" });

  if (error) throw error;

  return supabase.storage.from("quote-cards").getPublicUrl(filePath).data
    .publicUrl; // ← fully public URL
};
