
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || "" });

export const getMotivationalQuote = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Give me a single, unique, short motivational quote for a student today. No author name, just the quote text.",
    });
    return response.text?.trim() || "The secret of getting ahead is getting started.";
  } catch (err) {
    return "Believe in yourself and all that you are.";
  }
};

export const getStudyTips = async (subject: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 quick study tips for the subject: ${subject}. Format as a concise list.`,
    });
    return response.text?.trim() || "Stay focused, take breaks, and review often.";
  } catch (err) {
    return "Consistency is key.";
  }
};
