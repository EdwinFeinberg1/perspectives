import { NextResponse } from "next/server";
import { getApiRoute } from "@/app/constants/api-routes";
import { ModelName } from "@/app/types";

export const runtime = "edge";

/**
 * Main chat route that redirects to the appropriate model-specific endpoint
 * based on the selectedModel parameter in the request body
 */
export async function POST(req: Request) {
  console.log("🔑 Keys in process.env:", Object.keys(process.env));
  console.log(
    "🔑 OPENAI_API_KEY:",
    process.env.OPENAI_API_KEY?.slice(0, 8) || "(missing)"
  );

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY in production!" },
      { status: 500 }
    );
  }
  try {
    // Clone the request to read the body
    const clonedReq = req.clone();
    const body = await clonedReq.json();

    // Get the selected model from the request body
    const selectedModel = body.selectedModel as ModelName;

    if (!selectedModel) {
      return NextResponse.json({ error: "No model selected" }, { status: 400 });
    }

    // Get the appropriate API route for the selected model
    const apiRoute = getApiRoute(selectedModel);

    if (!apiRoute) {
      return NextResponse.json(
        { error: `Unknown model: ${selectedModel}` },
        { status: 400 }
      );
    }
    // Forward the request to the appropriate API route
    const targetUrl = new URL(apiRoute, req.url);
    const response = await fetch(targetUrl, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Ensure error status codes are properly forwarded
    if (!response.ok) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "Cache-Control": "no-transform",
          "Content-Type":
            response.headers.get("Content-Type") || "application/json",
        },
      });
    }

    // Return the response with proper headers to prevent compression issues
    return new Response(response.body, {
      headers: {
        "Cache-Control": "no-transform",
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}
