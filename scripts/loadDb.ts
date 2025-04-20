import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const {
    ASTRADB_DB_KEYSPACE,
    ASTRADB_DB_COLLECTION,
    ASTRA_DB_APPLICATION_TOKEN,
    ASTRADB_API_ENDPOINT,
    OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const rabbiData = [
  "https://torah.org/learning/mussar-psych-mussar2/",
  "https://torah.org/learning/mussar-psych-mussar3/",
  "https://torah.org/learning/mussar-psych-mussar4/",
  "https://torah.org/learning/mussar-psych-mussar5/",
  "https://torah.org/learning/mussar-psych-mussar6/",
  "https://torah.org/learning/mussar-psych-mussar7/",
  "https://torah.org/learning/mussar-psych-mussar8/",
  "https://torah.org/learning/mussar-psych-mussar9/",
  "https://torah.org/learning/mussar-psych-mussar10/",
  "https://torah.org/learning/mussar-psych-mussar11/",
  "https://torah.org/learning/mussar-psych-mussar12/",
  "https://torah.org/learning/mussar-psych-mussar13/",
  "https://torah.org/learning/mussar-psych-mussar14/",
  "https://torah.org/learning/mussar-psych-mussar15/",

  "https://torah.org/learning/tehillim-ch1/",
  "https://torah.org/learning/tehillim-ch2/",
  "https://torah.org/learning/tehillim-ch3/",
  "https://torah.org/learning/tehillim-ch4/",
  "https://torah.org/learning/tehillim-ch5/",
  "https://torah.org/learning/tehillim-ch6/",
  "https://torah.org/learning/tehillim-ch7/",
  "https://torah.org/learning/tehillim-ch8/",
  "https://torah.org/learning/tehillim-ch9/",
  "https://torah.org/learning/tehillim-ch10/",
  "https://torah.org/learning/tehillim-ch11/",
  "https://torah.org/learning/tehillim-ch12/",
  "https://torah.org/learning/tehillim-ch13/",
  "https://torah.org/learning/tehillim-ch14/",
  "https://torah.org/learning/tehillim-ch15/",
  "https://torah.org/learning/tehillim-ch16/",
  "https://torah.org/learning/tehillim-ch17/",
  "https://torah.org/learning/tehillim-ch18/",
  "https://torah.org/learning/tehillim-ch19/",
  "https://torah.org/learning/tehillim-ch20/",
  "https://torah.org/learning/tehillim-ch21/",
  "https://torah.org/learning/tehillim-ch22/",
  "https://torah.org/learning/tehillim-ch23/",
  "https://torah.org/learning/tehillim-ch24/",
  "https://torah.org/learning/tehillim-ch25/",
  "https://torah.org/learning/tehillim-ch26/",
  "https://torah.org/learning/tehillim-ch27/",
  "https://torah.org/learning/tehillim-ch28/",
  "https://torah.org/learning/tehillim-ch29/",
  "https://torah.org/learning/tehillim-ch30/",
  "https://torah.org/learning/tehillim-ch31/",
  "https://torah.org/learning/tehillim-ch32/",
  "https://torah.org/learning/tehillim-ch33/",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRADB_API_ENDPOINT, {
    keyspace: ASTRADB_DB_KEYSPACE,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRADB_DB_COLLECTION, {
    vector: {
      dimension: 1536,
      metric: similarityMetric,
    },
  });
  console.log(res);
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRADB_DB_COLLECTION);
  for await (const url of rabbiData) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });
      const vector = embedding.data[0].embedding;
      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log(res);
    }
  }
};

const scrapePage = async (url: string): Promise<string> => {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      evaluate: async (page, browser) => {
        // grab only the entry-content container
        const entry = await page.$("div.entry-content");
        const text = entry
          ? await page.evaluate(el => el.innerText, entry)
          : "";
        await browser.close();
        return text;
      },
    });
  
    // loader.scrape() returns whatever your evaluate() returned
    const scraped = await loader.scrape();
    return scraped?.trim() ?? "";
  };
  

createCollection().then(() => loadSampleData())