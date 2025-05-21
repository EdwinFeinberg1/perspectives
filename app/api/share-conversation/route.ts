import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { nanoid } from "nanoid";

// POST /api/share-conversation
// Expects a body: { conversation: Conversation }
// Returns: { id: string }
export async function POST(req: NextRequest) {
  try {
    const { conversation } = await req.json();

    if (!conversation) {
      return NextResponse.json(
        { error: "Missing conversation payload" },
        { status: 400 }
      );
    }

    // Generate a short, hard-to-guess id (10 random URL-friendly characters).
    const id = nanoid(10);

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("shared_conversations").insert({
      id,
      conversation,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id });
  } catch (err) {
    console.error("Share conversation handler error", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
