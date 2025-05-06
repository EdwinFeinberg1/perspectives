import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { logQuestion } from "../../../../lib/logging";
const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_CHRISTIANITY,
  ASTRA_DB_APPLICATION_TOKEN_CHRISTIANITY,
  ASTRADB_API_ENDPOINT_CHRISTIANITY,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_CHRISTIANITY);
const db = client.db(ASTRADB_API_ENDPOINT_CHRISTIANITY, {
  keyspace: ASTRADB_DB_KEYSPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Messages received:", messages.length);
    const latestMessage = messages[messages?.length - 1]?.content;

    // Extract IP address from request headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "127.0.0.1";

    await logQuestion(latestMessage, "PastorGPT", ipAddress);

    // Moderate the user input
    const moderationResponse = await openai.moderations.create({
      input: latestMessage,
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

    let docContext = "";

    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: latestMessage,
        encoding_format: "float",
      });

      try {
        const collection = await db.collection(
          ASTRADB_DB_COLLECTION_CHRISTIANITY
        );
        //find whats similar in our db to the latest message
        const cursor = collection.find(null, {
          sort: {
            $vector: embedding.data[0].embedding,
          },
          limit: 10,
        });
        const docs = (await cursor.toArray()).map((d) => d.text);
        docContext = JSON.stringify(docs);
      } catch (err) {
        console.error("AstraDB query error:", err);
        docContext = "";
      }
    } catch (embeddingErr) {
      console.error("OpenAI embedding generation error:", embeddingErr);
      return new Response("Error generating embeddings", { status: 500 });
    }

    //Kick off a streaming chat
    try {
      const result = streamText({
        model: aiSdkOpenai("gpt-3.5-turbo"),
        system: `
        You are PastorGPT, an AI pastor whose voice, tone, and message mirror the uplifting ministry of Joel Osteen.

          ### Core Style
          - Speak with warm enthusiasm and unwavering positivity.
          - Use conversational, relatable language—imagine you’re at Lakewood Church sharing hope with a good friend.
          - Keep paragraphs short (2–3 sentences), focused on encouragement and practical faith.
          - Sprinkle in rhetorical questions to engage (“Have you ever wondered how God’s favor could transform your day?”).
          - Include brief, vivid anecdotes or metaphors (e.g., “God’s love is like the sun breaking through the darkest clouds.”).

          ### Biblical Anchors
          - Anchor key points in Scripture, quoting verses in an accessible translation (e.g., NIV).  
            - Format quotes as:  
              > “For I know the plans I have for you…” (Jeremiah 29:11 NIV)
          - After each quotation, briefly explain how it applies to everyday life.

          ### Thematic Emphases
          - **Hope & Possibility**: Emphasize that God has a good plan and He delights in blessing His children.
          - **Faith in Action**: Encourage stepping out in faith with simple, practical next steps.
          - **Grace & Identity**: Remind listeners they are loved, chosen, and equipped—in Christ, they have all they need.
          - **Overcoming**: Frame challenges as opportunities to see God’s power at work.

          ### Formatting Guidelines
          - Open with a personal greeting and statement of vision (e.g., “Welcome, friend. Today I believe God is about to...”).
          - Use 1–2 bullet points only when listing practical application steps.
          - Close with a confident benediction and call to action (e.g., “So stand tall in faith, expect a blessing, and watch doors open for you today!”).

          When you respond, channel Joel Osteen’s signature warmth, focus on soaring hope, and practical faith applications.  
         CONTEXT:
         ${docContext}
      
         QUESTION: ${latestMessage}

        IMPORTANT: Always end your response with a 'Follow-up Questions' section using exactly this format:

          ## Follow-up Questions
          1. First suggested question?
          2. Second suggested question?
          3. Third suggested question?
        `,
        messages,
        maxTokens: 1024,
      });

      // Return the response with explicit options to handle potential issues
      return result.toDataStreamResponse({
        // Handle usage data properly - set to false if causing issues
        sendUsage: true,
        // Provide explicit error handling
        getErrorMessage: (error) => {
          if (error instanceof Error) {
            console.error("Detailed error:", error.message, error.stack);
            return error.message;
          }
          return String(error);
        },
      });
    } catch (streamErr) {
      console.error("Error creating stream:", streamErr);
      return new Response("Error creating response stream", { status: 500 });
    }
  } catch (err) {
    console.error("General error in API route:", err);
    return new Response("Internal error", { status: 500 });
  }
}
