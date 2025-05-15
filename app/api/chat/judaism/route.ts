//judaism/route.ts
import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
//import { logQuestion } from "../../../../lib/logging";

import { getTodayParsha } from "@/lib/tools/parshah/getTodayParsha";
import { summarizeParshah } from "@/lib/tools/parshah/summarizeParshah";
//import { logQuestion } from "@/lib/logging";

const {
  ASTRADB_DB_KEYSPACE,
  ASTRADB_DB_COLLECTION_JEWISH,
  ASTRA_DB_APPLICATION_TOKEN_JEWISH,
  ASTRADB_API_ENDPOINT_JEWISH,
  OPENAI_API_KEY,
} = process.env;

// Initialize clients
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_JEWISH!);
const db = client.db(ASTRADB_API_ENDPOINT_JEWISH!, {
  keyspace: ASTRADB_DB_KEYSPACE!,
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: Request) {
  //moderate the prompt that users submit.
  try {
    // Safely parse request body
    let messages;
    try {
      const body = await req.json();
      messages = body.messages;
      if (!messages || !Array.isArray(messages)) {
        throw new Error("Invalid messages format");
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: parseError.message,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const latestMessage = messages.at(-1)?.content || "";
/*
    // Extract IP address from request headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "not available";

    try {
      // Try to log the question, but don't let failures stop execution
      await logQuestion(latestMessage, "RabbiGPT", ipAddress);
    } catch (loggingError) {
      // Just log the error to console and continue
      console.error(
        "Failed to log question, continuing execution:",
        loggingError
      );
    }
*/
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

    // 1) Create an embedding for the user query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });
    const fullVector = embeddingResponse.data[0].embedding;

    const vector = fullVector.slice(0, 1024);

    let retrievedChunks: { ref: string; text: string }[] = [];
    try {
      if (!db) {
        throw new Error("Database client is not initialized");
      }
      const collection = await db.collection(ASTRADB_DB_COLLECTION_JEWISH!);

      const cursor = collection.find(/* no filter */ null, {
        sort: {
          $vector: vector,
        },
        limit: 10,
      });
      const docs = await cursor.toArray();
      retrievedChunks = docs.map((d) => ({ ref: d.ref, text: d.text }));
    } catch (err) {
      console.error("RabbiGPT: Vector search failed:", err);
      // Provide a fallback if vector search fails

      retrievedChunks = [
        {
          ref: "Fallback",
          text: "The Torah (תּוֹרָה) is the compilation of the first five books of the Hebrew Bible: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. These five books are also called the Pentateuch or the Chumash. The Torah contains the 613 mitzvot (commandments) that guide Jewish life and practice.",
        },
        {
          ref: "Shabbat",
          text: "Shabbat (שַׁבָּת) is the day of rest observed in Judaism from Friday evening to Saturday evening. It commemorates God's rest on the seventh day of Creation and the Exodus from Egypt. Shabbat observance includes lighting candles, special prayers, meals, and refraining from work.",
        },
      ];
    }

    // 3) Build a single context block
    //    e.g. "<ref>: <text>\n\n<ref2>: <text2>"
    const docContext = retrievedChunks
      .map(({ ref, text }) => `${ref}:\n${text}`)
      .join("\n\n");
    const SYSTEM_PROMPT = `
      You are RabbiGPT, speaking in the warm, story‑driven voice of Rabbi Simon Jacobson (author of *Toward a Meaningful Life*).
      
      ### Rabbinic Ethos & Voice
      - Write as a caring Chabad mentor: conversational, encouraging, and personal ("my friend," "you can…").
      - Weave in gentle Hebrew/Yiddish terms **and** immediately give the English meaning in parentheses.
      -  AVOID generic metaphors like "tapestry of life," "journey," or "intricately woven."      
      
      ### RESPONSE FLOW
      1. **Hook** – open with a relatable scenario, question, or short anecdote (≤ 4 lines).
      2. **Depth** – unpack the Chassidic concept or text that illuminates the issue.
      3. **Application** – give a practical takeaway the user can implement today.
      
      ### Function and Style
      - denounce hatred, coercion, or violence, and respond to hostile texts with a Jewish ethic of dignity, peace, and truth.
      - Uphold Ramban's mystical and theological vision, presenting angels, prophecy, and divine providence as real and metaphysically vital.
      
      FORMAT YOUR RESPONSES FOR READABILITY:
      - Use ### headings for main sections or topics
      - Add blank lines between paragraphs
      - Keep paragraphs concise (3-4 lines maximum) 
      - If using bullet points, add spacing between items
      - Use markdown formatting consistently
      - Use > for Torah quotations
      - **Do NOT include the words "Hook", "Depth", or "Application".**
      - Natural transitions are fine ("First…", "On a deeper level…", "Practically speaking…"), but no section headers.
      
      
      When citing sources:
      - When you quote or paraphrase from one of the provided passages, append its reference in square brackets immediately after the quote.  
        For example: "In the beginning God created the heavens and the earth" [Genesis 1:1].  
      - If you summarize a teaching, still mention its source: e.g. (Guide for the Perplexed 1:2).  
      - Use a bullet or block-quote format when giving multiple sourced points.
      
      
      Here are the relevant excerpts you may draw upon :
      ${docContext}
      
      Now answer the user's question, and be scrupulous about citing each time you use one of the above passages.
      
      If the user asks for "this week's parshah in a nutshell" or "<Parsha> in a nutshell":
       1) Call the getTodayParsha tool (or use its output's parshaName/parshaRef).
       2) Call the summarizeParsha tool with that name & ref.
       3) End with a link to the full text on Sefaria.
      IMPORTANT: Always end your response with a 'Follow-up Questions' section using exactly this format:
      
      ## Follow-up Questions : potential questions that user might ask next
      1. First suggested question?
      2. Second suggested question?
      3. Third suggested question?
      `;
    // 4) Kick off the streaming chat with your system prompt
    try {
      console.log(
        "RabbiGPT: Starting stream with messages:",
        JSON.stringify(messages.slice(-1))
      );

      // Log if this is likely a parshah query
      if (
        latestMessage.toLowerCase().includes("parsha") ||
        latestMessage.toLowerCase().includes("parshah") ||
        latestMessage.toLowerCase().includes("torah portion") ||
        latestMessage.toLowerCase().includes("this week")
      ) {
        console.log(
          "DETECTED PARSHAH QUERY: Tools should be called in sequence - getTodayParsha then summarizeParshah"
        );
      }

      const result = streamText({
        model: aiSdkOpenai("gpt-4o-mini"),

        tools: {
          getTodayParsha,
          summarizeParshah,
        },
        system: `
      You are RabbiGPT, a knowledgeable assistant for Jewish topics.
      
      IMPORTANT INSTRUCTIONS FOR PARSHA QUESTIONS:
      When the user asks about this week's parsha or Torah portion:
      
      1. FIRST call getTodayParsha tool with no parameters
      2. AFTER receiving the results with parshaName and parshaRef values
      3. THEN call summarizeParshah tool with those exact values from getTodayParsha
      4. WAIT for the summary to be generated and returned
      5. ONLY THEN respond to the user with:
         - The parsha information
         - The summary
         - A link to Sefaria
         - Follow-up questions
      
      NEVER RESPOND TO THE USER UNTIL AFTER BOTH TOOLS HAVE COMPLETED.
      You MUST call the tools in this order: getTodayParsha FIRST, then summarizeParshah SECOND.
      
      IF THE USER DID NOT ASK FOR A PARSHAH SUMMARY, USE THIS SYSTEM PROMPT:
      ${SYSTEM_PROMPT}
      `,
        messages,
        temperature: 0.7,
        maxTokens: 500,
      });

      // Return streaming response directly
      return result.toDataStreamResponse();
    } catch (streamError) {
      console.error("RabbiGPT: Stream generation error:", streamError);
      // Return a more detailed error to help debugging
      return new Response(
        JSON.stringify({
          error: "Error generating text stream",
          details: streamError.message || "Unknown stream error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("RabbiGPT: Route handler error:", err);
    return new Response(
      JSON.stringify({
        error: "An error occurred processing your request",
        details: err.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
