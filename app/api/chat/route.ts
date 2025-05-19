import { NextResponse } from "next/server";
import { getApiRoute } from "@/app/constants/api-routes";
import { ModelName } from "@/app/types";

export const runtime = "edge";

/**
 * Main chat route that redirects to the appropriate model-specific endpoint
 * based on the selectedModel parameter in the request body
 */
export async function POST(req: Request) {
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

    // Log the target URL being used
    const targetUrl = new URL(apiRoute, req.url);
    console.log("🔄 Forwarding to:", targetUrl.toString());

    // Forward the request to the appropriate API route
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward any other relevant headers
        ...Object.fromEntries(
          Array.from(req.headers.entries()).filter(([key]) =>
            ["x-forwarded-for", "user-agent"].includes(key.toLowerCase())
          )
        ),
      },
      body: JSON.stringify(body),
    });

    // Return the response from the model-specific endpoint
    return response;
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
