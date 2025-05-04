import { streamText } from "ai";

export const runtime = "edge";

export async function POST() {
  // Create an empty stream with a blank response
  const result = streamText({
    model: undefined,
    prompt: "",
  });

  return result.toDataStreamResponse();
}

export const dynamic = "force-dynamic";
