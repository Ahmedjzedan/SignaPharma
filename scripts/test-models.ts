import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Try .env.local first
dotenv.config(); // Fallback to .env

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // There isn't a direct listModels method on the client instance in some versions,
    // but usually we can try to guess or just test a few common ones.
    // However, the error message suggested calling ListModels.
    // The Node SDK might not expose it directly on genAI, but let's check.
    // Actually, for the GoogleGenerativeAI SDK, listing models might not be straightforward 
    // without using the REST API or a specific manager.
    
    // Let's try to just test a few likely candidates.
    const candidates = [
      "gemini-2.0-flash-lite-preview-02-05",
      "gemini-2.0-flash-lite",
    ];

    console.log("Testing model availability...");

    for (const modelName of candidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`✅ ${modelName} is AVAILABLE.`);
      } catch (error: any) {
        if (error.message.includes("404") || error.message.includes("not found")) {
             console.log(`❌ ${modelName} is NOT FOUND.`);
        } else if (error.message.includes("429")) {
             console.log(`⚠️ ${modelName} is AVAILABLE but Rate Limited.`);
        } else {
             console.log(`❓ ${modelName} error: ${error.message.split('\n')[0]}`);
        }
      }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
