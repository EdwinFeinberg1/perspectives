import fetch from "node-fetch";

interface SefariaTextResponse {
  he: string[];
  text: string[];
  ref: string;
  // other fields we don't need
}

/**
 * Fetches the full text for a given parsha reference from Sefaria API
 * Returns both Hebrew and English text
 */
export async function getParshaText(parshaRef: string): Promise<{
  hebrew: string;
  english: string;
}> {
  // Convert the ref format to what Sefaria API expects
  const apiRef = parshaRef.replace(/ /g, "_");
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(apiRef)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch text: ${response.status}`);
  }

  const data = (await response.json()) as SefariaTextResponse;

  // Join the arrays of text chunks into complete strings
  return {
    hebrew: data.he.join(" "),
    english: data.text.join(" "),
  };
}
