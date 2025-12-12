import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function fetchDrugDetailsFromGemini(drugName: string) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const models = [
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
  ];

  const prompt = `
    You are a medical database assistant. 
    Provide a detailed JSON object for the drug "${drugName}".
    
    The JSON schema must be exactly:
    {
      "brandName": "string",
      "genericName": "string",
      "manufacturerName": "string",
      "className": "string",
      "indications": "string (summary)",
      "mechanismOfAction": "string",
      "sideEffects": "string (summary)",
      "boxedWarning": "string (or null)",
      "formula": "string (chemical formula or active ingredient)",
      "dosage": "string (general summary)"
    }
    
    Ensure the data is accurate and professional.
    Return ONLY the JSON string, no markdown formatting.
  `;

  for (const modelName of models) {
    try {
      console.log(`🤖 Trying Gemini model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      console.log(`✅ Success with model: ${modelName}`);
      return JSON.parse(cleanedText);
    } catch (error: any) {
      console.warn(`⚠️ Failed with model ${modelName}: ${error.message?.split('\n')[0]}`);
      // Continue to next model if it's a rate limit (429) or not found (404) or other fetch error
      if (modelName === models[models.length - 1]) {
         console.error("❌ All models failed.");
         throw new Error("All Gemini models failed to fetch data.");
      }
    }
  }
}
