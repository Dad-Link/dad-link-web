// utils.ts

/**
 * Adds emojis to a given text based on context.
 * @param text - Input text to enrich with emojis.
 * @returns The enriched text.
 */
export const addEmojis = (text: string): string => {
  const emojiMap: { [key: string]: string } = {
    hello: "👋",
    thanks: "🙏",
    love: "❤️",
    happy: "😊",
    sad: "😢",
    wow: "🤩",
    angry: "😡",
  };

  const words = text.split(" ");
  const enrichedText = words
    .map((word) => (emojiMap[word.toLowerCase()] ? `${word} ${emojiMap[word.toLowerCase()]}` : word))
    .join(" ");

  return enrichedText;
};

/**
 * Simulates voice transcription functionality.
 * @returns A Promise that resolves with transcribed text.
 */
export const transcribeVoice = async (): Promise<string> => {
  // Simulate voice transcription (can integrate with APIs like Google Speech-to-Text in the future).
  return "This is a simulated transcribed voice message.";
};

/**
 * Sanitizes user input by removing unnecessary spaces and potentially harmful content.
 * @param input - The user input to sanitize.
 * @returns The sanitized input.
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>?/gm, ""); // Removes HTML tags
};

/**
 * Formats timestamps into a user-friendly string.
 * @param timestamp - Date object to format.
 * @returns A formatted timestamp string (e.g., "10:30 AM").
 */
export const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Fetches random fun facts for entertainment.
 * @returns A random fun fact.
 */
export const getRandomFunFact = (): string => {
  const facts = [
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
    "Octopuses have three hearts, and two of them stop beating when they swim.",
    "Bananas are berries, but strawberries aren't!",
    "The Eiffel Tower can grow taller in summer due to heat expansion.",
    "A day on Venus is longer than a year on Venus.",
  ];
  const randomIndex = Math.floor(Math.random() * facts.length);
  return facts[randomIndex];
};

/**
 * Detects the sentiment of a given text.
 * @param text - Input text to analyze.
 * @returns The detected sentiment: "positive", "neutral", or "negative".
 */
export const detectSentiment = (text: string): string => {
  const positiveWords = ["happy", "great", "fantastic", "love", "amazing"];
  const negativeWords = ["sad", "angry", "hate", "terrible", "bad"];
  const words = text.toLowerCase().split(" ");

  const positiveScore = words.filter((word) => positiveWords.includes(word)).length;
  const negativeScore = words.filter((word) => negativeWords.includes(word)).length;

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
};

/**
 * Generates a random string identifier.
 * @param length - Desired length of the identifier.
 * @returns A random alphanumeric string.
 */
export const generateRandomId = (length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

