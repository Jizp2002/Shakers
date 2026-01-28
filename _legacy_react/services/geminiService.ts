import { GoogleGenAI } from "@google/genai";
import { GenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askLocationAssistant = async (query: string): Promise<GenerationResponse> => {
  try {
    const modelId = "gemini-2.5-flash"; // Maps grounding supported on 2.5 series
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [{ text: `Regarding Camp Lakota in California: ${query}` }],
        },
      ],
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || "No response generated.";
    const groundingMetadata = candidate?.groundingMetadata;

    return {
      text,
      groundingMetadata: groundingMetadata as any,
    };
  } catch (error) {
    console.error("Error querying Gemini:", error);
    throw error;
  }
};