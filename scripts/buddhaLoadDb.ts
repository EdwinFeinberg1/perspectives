// scripts/buddhaLoadDb.ts
// ------------------------------------------------------------------
// Ingest local Buddhist PDFs into AstraDB with OpenAI embeddings.
// Now resilient: skips “collection already exists”, logs progress, and
// fails fast on insert errors so you see why nothing was written.
// ------------------------------------------------------------------

import { DataAPIClient } from "@datastax/astra-db-ts";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import OpenAI from "openai";

import fs from "fs/promises";
import path from "path";
import "dotenv/config";

// ------------------------------------------------------------------
// Types & ENV
// ------------------------------------------------------------------

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const {
  ASTRADB_DB_KEYSPACE,             
  ASTRADB_DB_COLLECTION_BUDDHA,                
  ASTRA_DB_APPLICATION_TOKEN_BUDDHA,
  ASTRA_DB_API_ENDPOINT_BUDDHA,
  OPENAI_API_KEY,
} = process.env;

if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY in .env");
if (!ASTRA_DB_APPLICATION_TOKEN_BUDDHA) throw new Error("Missing ASTRA_DB_APPLICATION_TOKEN in .env");
if (!ASTRA_DB_API_ENDPOINT_BUDDHA) throw new Error("Missing ASTRADB_API_ENDPOINT in .env");

// ------------------------------------------------------------------
// Clients
// ------------------------------------------------------------------

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN_BUDDHA);
const db = client.db(ASTRA_DB_API_ENDPOINT_BUDDHA, {
  keyspace: ASTRADB_DB_KEYSPACE,
});

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

// Folder with your PDFs. Matches the VS Code screenshot: app/assets/pdfs/
const PDF_DIR = path.resolve(process.cwd(), "app", "assets", "pdfs");

/**
 * Ensure the vector collection exists; skip creating if it’s already there.
 */
async function ensureCollection(similarity: SimilarityMetric = "dot_product") {
  try {
    await db.createCollection(ASTRADB_DB_COLLECTION_BUDDHA, {
      vector: { dimension: 1536, metric: similarity },
    });
    console.log(`✅ Created collection '${ASTRADB_DB_COLLECTION_BUDDHA}'`);
  } catch (err: any) {
    if (
      err?.name === "CollectionAlreadyExistsError" ||
      /already exists/i.test(err?.message)
    ) {
      console.log(`ℹ️  Collection '${ASTRADB_DB_COLLECTION_BUDDHA}' already exists; continuing`);
    } else {
      throw err;
    }
  }
}

/** Load a local PDF and return its full text */
async function loadPdf(filePath: string): Promise<string> {
  const loader = new PDFLoader(filePath);
  const docs   = await loader.load();
  return docs.map((d) => d.pageContent).join("\n");
}

/** Return absolute paths to every *.pdf under PDF_DIR */
async function getLocalPdfPaths(): Promise<string[]> {
  const files = await fs.readdir(PDF_DIR);
  return files.filter((f) => /\.pdf$/i.test(f)).map((f) => path.join(PDF_DIR, f));
}

/** Main ingest routine */
async function ingest() {
  // 1) collection handle
  const collection = await db.collection(ASTRADB_DB_COLLECTION_BUDDHA);

  // 2) source files
  const pdfPaths = await getLocalPdfPaths();
  console.log(`📂 Found ${pdfPaths.length} PDF(s) in ${PDF_DIR}`);
  if (pdfPaths.length === 0) throw new Error("No PDF files found – aborting");

  let inserted = 0;

  // 3) each PDF ➜ chunks ➜ embeddings ➜ insert
  for (const file of pdfPaths) {
    console.log(`—— Processing ${path.basename(file)}`);
    const content = await loadPdf(file);
    const chunks  = await splitter.splitText(content);

    for (const chunk of chunks) {
      const { data } = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });

      try {
        await collection.insertOne({
          $vector: data[0].embedding,
          text: chunk,
          source: path.basename(file),
        });
        inserted++;
      } catch (err) {
        console.error("❌ Insert failed", err);
        throw err;
      }
    }
  }

  console.log(`🎉  Ingestion complete – inserted ${inserted} chunks`);
}

// ------------------------------------------------------------------
// Kick‑off
// ------------------------------------------------------------------

(async () => {
  try {
    await ensureCollection();
    await ingest();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
