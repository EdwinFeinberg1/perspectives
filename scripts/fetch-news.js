#!/usr/bin/env node

// Standalone script to fetch and store news in Supabase
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Faith types
const FAITH_TYPES = ["rabbi", "pastor", "imam", "buddha"];

// Keywords for relevance filtering
const FAITH_KEYWORDS = {
  rabbi: ["jewish", "judaism", "rabbi", "israel", "synagogue"],
  pastor: ["christian", "church", "jesus", "bible", "pastor"],
  imam: ["muslim", "islam", "imam", "quran", "mosque"],
  buddha: ["buddhist", "buddhism", "buddha", "monk", "temple"],
};

const PUBLIC_INTEREST_KEYWORDS = [
  "election",
  "government",
  "war",
  "conflict",
  "peace",
  "treaty",
  "geopolitics",
  "economy",
  "inflation",
  "human rights",
  "inequality",
  "justice",
  "protest",
  "climate",
  "environment",
  "health",
  "pandemic",
  "education",
  "migration",
  "united nations",
];

const CORE_RELIGIOUS_TERMS = [
  "faith",
  "religion",
  "spiritual",
  "god",
  "prayer",
  "holy",
  "sacred",
  "theology",
  "interfaith",
];

// Initialize Supabase client directly (no cookies/SSR)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing Supabase credentials in .env file");
  process.exit(1);
}

console.log("Using Supabase URL:", supabaseUrl);
console.log(
  "Using service role key:",
  supabaseKey.substring(0, 5) +
    "..." +
    supabaseKey.substring(supabaseKey.length - 5)
);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to fetch news from a category
async function fetchNewsFromCategory(category, country = "us") {
  const params = new URLSearchParams({
    category: category,
    country: country,
    apiKey: process.env.NEWS_API_KEY,
    pageSize: "30",
  });
  const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?${params.toString()}`;

  try {
    const res = await fetch(NEWS_API_URL);
    if (!res.ok) {
      console.error(
        `NewsAPI request failed for category ${category}:`,
        res.status
      );
      return [];
    }
    const { articles } = await res.json();
    return articles || [];
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error);
    return [];
  }
}

// Function to transform and filter articles
function transformAndFilterArticle(article, idx) {
  const title = article.title?.trim() || "Untitled";
  const description = article.description?.trim() || "";
  const contentText = `${title} ${description}`.toLowerCase();

  const matchedFaithKeywordsCount = Object.values(FAITH_KEYWORDS)
    .flat()
    .filter((kw) => contentText.includes(kw)).length;

  const mentionsPublicInterestTopic = PUBLIC_INTEREST_KEYWORDS.some((kw) =>
    contentText.includes(kw)
  );
  const mentionsCoreReligiousTerm = CORE_RELIGIOUS_TERMS.some((kw) =>
    contentText.includes(kw)
  );

  let keepArticle = false;
  if (mentionsPublicInterestTopic) {
    keepArticle = true;
  } else if (matchedFaithKeywordsCount >= 1 && mentionsCoreReligiousTerm) {
    keepArticle = true;
  } else if (matchedFaithKeywordsCount >= 2) {
    keepArticle = true;
  } else if (mentionsCoreReligiousTerm) {
    keepArticle = true;
  }

  if (!keepArticle) {
    return null;
  }

  // Generate a proper UUID instead of SHA-1 hash
  return {
    id: uuidv4(),
    title: title,
    description: description,
    url: article.url || "#",
    imageUrl: article.urlToImage || `https://picsum.photos/seed/${idx}/800/600`,
    publishedAt: article.publishedAt || new Date().toISOString(),
    faiths: FAITH_TYPES,
  };
}

// Generate perspective for one faith
async function generatePerspective(newsItem, faith) {
  const faithTitleMap = {
    rabbi: "Rabbi GPT",
    pastor: "Pastor GPT",
    imam: "Imam GPT",
    buddha: "Buddha GPT",
  };

  try {
    const prompt = `As ${faithTitleMap[faith]}, please provide a thoughtful perspective (3-4 paragraphs) on the following news article from your religious tradition.\n\nTITLE: ${newsItem.title}\n\nDESCRIPTION: ${newsItem.description}\n`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are ${faithTitleMap[faith]}, a wise religious leader who provides thoughtful perspectives on current events.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error(`Error generating perspective for ${faith}:`, error);
    return `[Error generating ${faithTitleMap[faith]}'s perspective]`;
  }
}

// Main function
async function fetchAndStoreNews() {
  try {
    console.log("Started news fetch process...");
    const categoriesToFetch = ["general", "politics", "world"];
    let allArticles = [];

    // Fetch news articles
    for (const category of categoriesToFetch) {
      if (category === "world") {
        const worldParams = new URLSearchParams({
          q: PUBLIC_INTEREST_KEYWORDS.slice(0, 5).join(" OR "),
          language: "en",
          sortBy: "relevancy",
          pageSize: "20",
          apiKey: process.env.NEWS_API_KEY,
        });
        const WORLD_NEWS_API_URL = `https://newsapi.org/v2/everything?${worldParams.toString()}`;

        try {
          const worldRes = await fetch(WORLD_NEWS_API_URL);
          if (worldRes.ok) {
            const worldData = await worldRes.json();
            allArticles = allArticles.concat(worldData.articles || []);
          } else {
            console.error(
              `NewsAPI request failed for world query:`,
              worldRes.status
            );
          }
        } catch (error) {
          console.error("Error fetching world news:", error);
        }
      } else {
        const categoryArticles = await fetchNewsFromCategory(category, "us");
        allArticles = allArticles.concat(categoryArticles);
      }
    }

    // Remove duplicates
    const uniqueArticles = Array.from(
      new Map(allArticles.map((a) => [a.url, a])).values()
    );

    // Transform and filter articles
    const processedNews = uniqueArticles
      .map((article, index) => transformAndFilterArticle(article, index))
      .filter((article) => article !== null)
      .slice(0, 5); // Limit to 5 articles

    if (processedNews.length === 0) {
      console.log("No relevant news articles found.");
      return;
    }

    console.log(`Found ${processedNews.length} relevant news articles.`);

    // Prepare the news items for Supabase
    const newsItems = processedNews.map((item) => {
      // PostgreSQL expects arrays in a specific format
      const faithsArray = `{${item.faiths.map((f) => `"${f}"`).join(",")}}`;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        image_url: item.imageUrl,
        published_at: item.publishedAt,
        faiths: faithsArray, // PostgreSQL array format: {"value1","value2"}
        created_at: new Date().toISOString(),
      };
    });

    // Insert news items
    const { error: newsError } = await supabase
      .from("news")
      .upsert(newsItems, { onConflict: "id" });

    if (newsError) {
      console.error("Error storing news in Supabase:", newsError);
      return;
    }

    console.log("Successfully stored news articles in Supabase.");

    // Generate and store perspectives for each article and faith
    for (const newsItem of processedNews) {
      console.log(`Generating perspectives for news: ${newsItem.title}`);

      for (const faith of newsItem.faiths) {
        console.log(`Generating ${faith} perspective...`);

        // Insert empty perspective first to establish the record
        const { error: emptyPerspectiveError } = await supabase
          .from("perspectives")
          .upsert(
            {
              news_id: newsItem.id,
              faith: faith,
              perspective: "",
              created_at: new Date().toISOString(),
            },
            { onConflict: "news_id,faith" }
          );

        if (emptyPerspectiveError) {
          console.error(
            `Error creating empty perspective for ${faith}:`,
            emptyPerspectiveError
          );
          continue;
        }

        // Generate the perspective
        const perspective = await generatePerspective(newsItem, faith);

        // Update with the generated perspective
        const { error: updateError } = await supabase
          .from("perspectives")
          .update({
            perspective: perspective,
          })
          .eq("news_id", newsItem.id)
          .eq("faith", faith);

        if (updateError) {
          console.error(
            `Error updating perspective for ${faith}:`,
            updateError
          );
        } else {
          console.log(
            `Successfully generated and stored ${faith} perspective.`
          );
        }
      }
    }

    console.log("News fetch and store process completed successfully!");
  } catch (error) {
    console.error("Error in fetch and store process:", error);
  }
}

// Run the main function
fetchAndStoreNews()
  .then(() => {
    console.log("Script execution completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script execution failed:", error);
    process.exit(1);
  });
