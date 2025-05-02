/**
 * Utility functions for chat message processing
 */

/**
 * Extract follow-up questions from message content
 * @param content The message content to extract questions from
 * @returns Array of extracted questions
 */
export const extractFollowUpQuestions = (content: string): string[] => {
  try {
    // Match the section heading for "Follow-up Questions"
    const sectionRegex = /##?\s*Follow-up Questions\s*\n([\s\S]*?)(?:\n##|$)/i;
    const sectionMatch = content.match(sectionRegex);
    if (sectionMatch && sectionMatch[1]) {
      // Extract numbered questions (1. Question text?)
      const numberedQuestionsRegex = /\d+\.\s+(.+?\?)/g;
      const section = sectionMatch[1];

      const matches = Array.from(section.matchAll(numberedQuestionsRegex));
      if (matches && matches.length > 0) {
        return matches.map((match) => match[1].trim());
      }
    }
    // Fallback: Try to find any numbered questions anywhere in the text
    // This helps with inconsistently formatted responses
    const anyNumberedQuestionsRegex = /\d+\.\s+(.+?\?)/g;
    const anyMatches = Array.from(content.matchAll(anyNumberedQuestionsRegex));
    return anyMatches.map((match) => match[1].trim());
  } catch (error) {
    console.error("Error extracting follow-up questions:", error);
    return [];
  }
};

/**
 * Remove the follow-up questions section from message content
 * @param content The message content to process
 * @returns The message content without the follow-up questions section
 */
export const removeFollowUpSection = (content: string): string => {
  try {
    // Remove the "Follow-up Questions" section and everything after it
    return content.replace(/##?\s*Follow-up Questions[\s\S]*$/, "").trim();
  } catch (error) {
    console.error("Error removing follow-up section:", error);
    return content;
  }
};
