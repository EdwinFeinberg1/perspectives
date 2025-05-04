import { supabase } from "./supabase";

export async function logQuestion(
  question: string,
  modelName: string,
  conversationId?: string
) {
  try {
    const { error } = await supabase.from("questions").insert({
      question,
      model_name: modelName,
      conversation_id: conversationId,
    });

    if (error) {
      console.error("Error logging question:", error);
    }
  } catch (err) {
    console.error("Failed to log question:", err);
  }
}
