import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { newsId: string } }
) {
  try {
    const supabase = await createClient();
    const newsId = params.newsId;

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
  } catch (error) {
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
