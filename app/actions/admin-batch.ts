"use server";

import { db } from "@/lib/db";
import { drugBatches, drugRequests, drugs, manufacturers, drugClasses } from "@/lib/db/schema";
import { eq, and, isNull, count, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function addToBatch(requestId: string) {
  try {
    // 1. Find an open batch with < 20 items
    let openBatch = await db.query.drugBatches.findFirst({
      where: eq(drugBatches.status, 'open'),
      with: {
        requests: true,
      }
    });

    // Check if batch is full (>= 20 items)
    if (openBatch && openBatch.requests.length >= 20) {
      // Mark as processing or just leave it open but create a new one?
      // Let's just create a new one if the current open one is full.
      // Or better, find the *latest* open batch that isn't full.
      // For simplicity, if the found open batch is full, we'll create a new one.
       openBatch = undefined; // Force creation of new batch
    }

    if (!openBatch) {
      // Create new batch
      const [newBatch] = await db.insert(drugBatches).values({
        status: 'open',
      }).returning();
      openBatch = { ...newBatch, requests: [] };
    }

    // 2. Add request to batch
    await db.update(drugRequests)
      .set({ batchId: openBatch.id })
      .where(eq(drugRequests.id, requestId));

    revalidatePath("/admin/requests");
    revalidatePath("/admin/batches");
    return { success: true, message: "Added to batch" };
  } catch (error) {
    console.error("Error adding to batch:", error);
    return { success: false, message: "Failed to add to batch" };
  }
}

export async function removeFromBatch(requestId: string) {
  try {
    await db.update(drugRequests)
      .set({ batchId: null })
      .where(eq(drugRequests.id, requestId));

    revalidatePath("/admin/requests");
    revalidatePath("/admin/batches");
    return { success: true, message: "Removed from batch" };
  } catch (error) {
    console.error("Error removing from batch:", error);
    return { success: false, message: "Failed to remove from batch" };
  }
}

export async function processBatch(batchId: string) {
  try {
    // 1. Get batch and requests
    const batch = await db.query.drugBatches.findFirst({
      where: eq(drugBatches.id, batchId),
      with: {
        requests: true,
      }
    });

    if (!batch || batch.requests.length === 0) {
      return { success: false, message: "Batch empty or not found" };
    }

    // Update status to processing
    await db.update(drugBatches)
      .set({ status: 'processing' })
      .where(eq(drugBatches.id, batchId));

    // 2. Prepare Gemini Prompt
    const drugNames = batch.requests.map(r => r.drugName).join(", ");
    // DO NOT CHANGE THIS MODEL. User requested ONLY 2.5/2.0 Flash/Flash-Lite.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a pharmaceutical database expert.
      I have a list of drug names: ${drugNames}.
      
      For EACH drug, provide the following details in a JSON array.
      If a drug name corresponds to multiple distinct brand names (e.g. Morphine -> Kadian, MS Contin), create a separate object for EACH brand name.
      If a drug has multiple manufacturers, create separate entries for each if they are distinct brands.
      
      JSON Structure for each object:
      {
        "brand_name": "string",
        "generic_name": "string",
        "manufacturer_name": "string",
        "pharm_class": ["string"], // Array of strings
        "indications_and_usage": "string (summary)",
        "mechanism_of_action": "string (summary)",
        "dosage_and_administration": "string (summary)",
        "warnings": "string (summary)",
        "active_ingredient": "string"
      }

      Return ONLY the JSON array. No markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean markdown if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const drugDataList = JSON.parse(jsonStr);

    // 3. Process each drug
    for (const drugData of drugDataList) {
      // Find matching request(s) - handle case sensitivity roughly
      const matchingRequests = batch.requests.filter(r => 
        r.drugName.toLowerCase() === drugData.brand_name.toLowerCase() || 
        r.drugName.toLowerCase() === drugData.generic_name.toLowerCase()
      );

      if (matchingRequests.length === 0) continue;

      // Create Manufacturer
      let manufacturerId: string;
      const existingMan = await db.query.manufacturers.findFirst({
        where: eq(manufacturers.name, drugData.manufacturer_name)
      });
      if (existingMan) {
        manufacturerId = existingMan.id;
      } else {
        const [newMan] = await db.insert(manufacturers).values({ name: drugData.manufacturer_name }).returning();
        manufacturerId = newMan.id;
      }

      // Create Class
      let classId: string;
      const className = drugData.pharm_class[0] || "Unclassified";
      const existingClass = await db.query.drugClasses.findFirst({
        where: eq(drugClasses.name, className)
      });
      if (existingClass) {
        classId = existingClass.id;
      } else {
        const [newClass] = await db.insert(drugClasses).values({ name: className }).returning();
        classId = newClass.id;
      }

      // Create Drug
      const drugId = crypto.randomUUID();
      await db.insert(drugs).values({
        id: drugId,
        brandName: drugData.brand_name,
        genericName: drugData.generic_name,
        manufacturerId,
        classId,
        indicationsAndUsage: drugData.indications_and_usage,
        mechanismOfAction: drugData.mechanism_of_action,
        dosageAndAdministration: drugData.dosage_and_administration,
        boxedWarning: drugData.warnings,
        formula: drugData.active_ingredient,
        description: drugData.indications_and_usage, // Fallback
      });

      // Update Requests
      for (const req of matchingRequests) {
        await db.update(drugRequests).set({
          status: 'approved',
          createdDrugId: drugId,
        }).where(eq(drugRequests.id, req.id));
      }
    }

    // Update Batch Status
    await db.update(drugBatches)
      .set({ status: 'completed' })
      .where(eq(drugBatches.id, batchId));

    revalidatePath("/admin/batches");
    revalidatePath("/admin/requests");
    return { success: true, message: "Batch processed successfully" };

  } catch (error) {
    console.error("Batch processing error:", error);
    await db.update(drugBatches)
      .set({ status: 'failed' })
      .where(eq(drugBatches.id, batchId));
    return { success: false, message: "Batch processing failed" };
  }
}

export async function deleteBatch(batchId: string) {
    try {
        // First, unlink all requests
        await db.update(drugRequests)
            .set({ batchId: null })
            .where(eq(drugRequests.batchId, batchId));

        // Then delete the batch
        await db.delete(drugBatches).where(eq(drugBatches.id, batchId));
        
        revalidatePath("/admin/batches");
        return { success: true };
    } catch (error) {
        console.error("Error deleting batch:", error);
        return { success: false, message: "Failed to delete batch" };
    }
}
