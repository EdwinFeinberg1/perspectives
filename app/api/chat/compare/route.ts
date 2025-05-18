import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { logQuestion } from "@/lib/logging";
import OpenAI from "openai";

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
export async function POST(req: Request) {
  try {
    const { messages, selectedModels } = await req.json();

    // Extract IP address from request headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "not available";

    try {
      // Try to log the question, but don't let failures stop execution
      await logQuestion(
        messages[messages.length - 1].content,
        "CompareGPT",
        ipAddress
      );
    } catch (loggingError) {
      // Just log the error to console and continue
      console.error(
        "Failed to log question, continuing execution:",
        loggingError
      );
    }

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    if (!selectedModels || selectedModels.length < 2) {
      return new Response(
        "At least two models must be selected for comparison",
        { status: 400 }
      );
    }
    // Moderate the user input
    const moderationResponse = await openai.moderations.create({
      input: messages[messages.length - 1].content,
    });

    // Check if content is flagged
    const flagged = moderationResponse.results[0]?.flagged;
    if (flagged) {
      console.warn(
        "RabbiGPT: Content moderation flagged input",
        moderationResponse.results[0]
      );
      return new Response(
        JSON.stringify({
          error:
            "Your message may contain content that violates our usage policies.",
          flagged: true,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const modelResponses = messages.filter(
      (m) =>
        m.role === "assistant" && m.model && selectedModels.includes(m.model)
    );

    const systemPrompt = `You are a comprehensive religious studies scholar with deep expertise in comparing religious traditions.

You MUST analyze how different religious perspectives (${selectedModels.join(
      ", "
    )}) approach the given question.

${
  modelResponses.length > 0
    ? `
IMPORTANT: You have been provided with the responses from the individual religious models. Your task is to ANALYZE these responses and identify the unique aspects and similarities between them. DO NOT create your own religious perspectives - use ONLY the provided model responses for your analysis.

The responses from different religious perspectives are:
${modelResponses
  .map(
    (m) => `
### ${m.model || "Unknown Model"}
${m.content}
`
  )
  .join("\n")}
`
    : `
NOTE: You don't have access to the individual model responses yet. Make your best comparison based on your knowledge of these religious traditions.
`
}

You MUST strictly follow these formatting rules when generating responses:

1. Begin with a JSON block containing the key comparison data (uniquePoints and similarities):

\`\`\`json
{
  "uniquePoints": {
    "RabbiGPT": ["point 1", "point 2", "point 3"],
    "PastorGPT": ["point 1", "point 2", "point 3"],
    "BuddhaGPT": ["point 1", "point 2", "point 3"],
    "ImamGPT": ["point 1", "point 2", "point 3"]
  },
  "similarities": ["similarity 1", "similarity 2", "similarity 3"]
}
\`\`\`

2. After the JSON block, provide a well-formatted response with proper Markdown:

## Overview
(A concise 3-4 line overview of the question from different perspectives)

## Unique Perspectives

### RabbiGPT
- Point one explanation with a blank line after
- Point two explanation

### PastorGPT
- Point one explanation with a blank line after
- Point two explanation

### BuddhaGPT
- Point one explanation with a blank line after
- Point two explanation

(Include sections only for the traditions selected by the user)

## Common Ground
- First similarity with a blank line after
- Second similarity

## Follow-up Questions
1. First suggested question?
2. Second suggested question?
3. Third suggested question?

Important formatting requirements:
- Use PROPER Markdown headings with ## and ###
- Add BLANK LINES between paragraphs and bullet points
- Make bullet points with a hyphen followed by a space (- )
- Number lists with numbers followed by a period and space (1. )
- Keep paragraphs SHORT (3-4 lines maximum)
- Structure the response like a WELL-ORGANIZED article
- Do NOT use asterisks (**) for formatting - use Markdown headings instead
- Use blockquotes (>) for important quotations or scriptures
- Ensure sufficient spacing between sections for readability

Only include the religious traditions that were selected by the user: ${selectedModels.join(
      ", "
    )}.
`;

    // Use the streamText function from the AI SDK
    const result = streamText({
      model: aiSdkOpenai("gpt-3.5-turbo"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 2048,
    });

    // Return the response using the SDK's built-in stream handler
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in compare route:", error);
    return new Response("Error processing your request", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
