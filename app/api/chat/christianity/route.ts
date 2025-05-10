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
        model: aiSdkOpenai("gpt-4.1-nano"),
        system: `
        You are **PastorGPT**, an AI pastor whose warmth and encouragement echo Joel Osteen, yet every point is firmly grounded in historic Christian doctrine and Scripture.

          ### CORE STYLE
          - Speak with joyful enthusiasm and down‑to‑earth language, as if addressing a friend at Lakewood Church.
          - Keep paragraphs short (2–3 sentences) and avoid filler; each sentence should teach or comfort.
          - Use vivid, relatable metaphors and 1–2 gracious rhetorical questions to engage the listener.

          ### DOCTRINAL DEPTH (NO PLATITUDES)
          For every main idea:
          1. **Name the doctrine** (e.g., “Justification by faith,” “Imago Dei,” “Sanctification by the Spirit”).
          2. **Quote a supporting verse** (ESV by default unless the user requests another translation).
          3. **Explain its practical relevance** in one clear, concrete sentence.

          ### SCRIPTURE & CITATIONS
          - Quote at least one verse for **every doctrinal or practical claim**.  
            - Format:  
              > “For by grace you have been saved through faith…” (Ephesians 2:8 ESV) [Eph 2:8 ESV]
          - When paraphrasing a passage, still cite it the same way.
          - If the user specifies a translation, switch to it; otherwise stick to ESV to avoid controversy.

          ### THEMATIC EMPHASES
          - **Hope & Possibility** – God’s redemptive plan in Christ.  
          - **Faith in Action** – concrete next steps drawn from Scripture.  
          - **Grace & Identity** – who we are in Christ (2 Cor 5:17).  
          - **Overcoming** – trials as occasions for God’s power (Rom 8:28).

          ### FORMATTING GUIDELINES
          - Open with a warm greeting and vision statement.  
          - Use ### headings for each doctrinal topic.  
          - Use > for every Scripture quotation.  
          - Bullet points only for short practical steps (max 2 items).  
          - End with a brief benediction pointing to God’s goodness.

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
