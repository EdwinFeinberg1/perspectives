// src/getCalendar.ts
import fetch from "node-fetch";

// Define the type for the API response

// Define the type for the API response
interface CalendarsResponse {
  calendar_items: Array<{
    title: {
      en: string;
      he?: string;
    };
    displayValue: {
      en: string;
      he?: string;
    };
    ref: string;
    // other fields we don't need
  }>;
}

/**
 * Fetches *today's* Parashat Hashavua info (in America/Los_Angeles time)
 * and returns its displayValue (e.g. "Toldot") and ref (e.g. "Genesis 25:19-28:9").
 */
export async function getTodayParsha(): Promise<{
  parshaName: string;
  parshaRef: string;
} | null> {
  try {
    const today = new Date();
    console.log(`Getting parsha for date: ${today.toISOString()}`);

    const params = new URLSearchParams({
      year: today.getUTCFullYear().toString(),
      month: (today.getUTCMonth() + 1).toString(),
      day: today.getUTCDate().toString(),
      timezone: "America/Los_Angeles",
    });

    const url = `https://www.sefaria.org/api/calendars?${params}`;
    console.log(`Fetching calendar from: ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        `Sefaria calendar API error: ${res.status} ${res.statusText}`
      );
      throw new Error(`Calendar fetch failed: ${res.status}`);
    }

    const data = await res.json();
    const typedData = data as CalendarsResponse;

    if (!typedData || !typedData.calendar_items) {
      console.error("Sefaria API returned unexpected structure:", data);
      throw new Error("Unexpected API response structure");
    }

    console.log(`Got ${typedData.calendar_items.length} calendar items`);

    // Find the weekly Torah portion entry:
    const parshaItem = typedData.calendar_items.find(
      (item) => item.title.en === "Parashat Hashavua"
    );

    if (!parshaItem) {
      console.warn("No parsha found in calendar items");
      console.log(
        "Available calendar items:",
        typedData.calendar_items.map((item) => item.title.en).join(", ")
      );
      return null;
    }

    console.log(
      `Found parsha: ${parshaItem.displayValue.en} (${parshaItem.ref})`
    );
    return {
      parshaName: parshaItem.displayValue.en,
      parshaRef: parshaItem.ref,
    };
  } catch (error) {
    console.error("Error in getTodayParsha calendar function:", error);
    throw error; // Rethrow so caller can handle or report
  }
}

// quick test
if (require.main === module) {
  getTodayParsha()
    .then((p) => {
      if (p) {
        console.log(`This week's parsha is ${p.parshaName} (${p.parshaRef})`);
      } else {
        console.log("No parsha found for today");
      }
    })
    .catch(console.error);
}
