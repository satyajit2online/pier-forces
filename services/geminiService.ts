import { GoogleGenAI } from "@google/genai";
import { PierData, Metric } from "../types";

export const analyzeDataWithGemini = async (
  data: PierData[], 
  metric: Metric
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  // Prepare a summary of the data to avoid token limits if dataset is huge
  // We will send the top 20 highest loads
  const sortedData = [...data].sort((a, b) => Math.abs(b[metric]) - Math.abs(a[metric]));
  const topLoads = sortedData.slice(0, 30).map(d => 
    `${d.Story} - ${d.Pier}: ${d[metric]} kN`
  ).join('\n');

  const prompt = `
    You are a structural engineer analyzing column pier forces.
    The following list contains the top 30 highest loads (Metric: ${metric}) in the building for the 'Bottom' location of piers.
    Values are in kN or kN-m. Negative P usually indicates compression.

    Data:
    ${topLoads}

    Please provide a concise executive summary (max 3 paragraphs) identifying:
    1. Which specific columns (Piers) are experiencing the most critical loads?
    2. Are there specific stories where loads are concentrated?
    3. Any structural recommendations or observations based on these high values?

    Format using Markdown.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate analysis from Gemini.");
  }
};
