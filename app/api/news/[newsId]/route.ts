import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ newsId: string }> }
) {
  try {
    const supabase = await createClient();
    const { newsId } = await context.params;

    const { data, error } = await supabase
      .from("news")
      .select("title, description")
      .eq("id", newsId)
      .single();

    if (error || !data) {
      return new NextResponse(
        JSON.stringify({ error: "News article not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in news API:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
