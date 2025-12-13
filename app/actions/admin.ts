"use server";

import { db } from "@/lib/db";
import { drugRequests, drugs, manufacturers, drugClasses, cases } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { fetchDrugDetailsFromGemini } from "@/lib/gemini";

export async function approveDrugRequest(requestId: string, drugName: string) {
  try {
    // 1. Fetch data from Gemini
    console.log(`🤖 Fetching details for ${drugName} from Gemini...`);
    const aiDataList = await fetchDrugDetailsFromGemini(drugName);
    console.log(`📦 Gemini response received for ${drugName}: ${Array.isArray(aiDataList) ? aiDataList.length : 1} items`);
    
    if (!aiDataList || (Array.isArray(aiDataList) && aiDataList.length === 0)) {
        throw new Error("AI could not find data for this drug");
    }

    // Normalize to array if it returned a single object (backward compatibility)
    const drugsToCreate = Array.isArray(aiDataList) ? aiDataList : [aiDataList];
    let firstCreatedDrugId = null;

    for (const aiData of drugsToCreate) {
        // 2. Save to Database (Reuse logic from seed script essentially)
        
        // Handle Manufacturer
        let manufacturerId;
        const existingManufacturer = await db.query.manufacturers.findFirst({
            where: eq(manufacturers.name, aiData.manufacturerName)
        });

        if (existingManufacturer) {
            manufacturerId = existingManufacturer.id;
        } else {
            const newManufacturer = await db.insert(manufacturers).values({
                name: aiData.manufacturerName
            }).returning();
            manufacturerId = newManufacturer[0].id;
        }

        // Handle Class
        let classId;
        const existingClass = await db.query.drugClasses.findFirst({
            where: eq(drugClasses.name, aiData.className)
        });

        if (existingClass) {
            classId = existingClass.id;
        } else {
            const newClass = await db.insert(drugClasses).values({
                name: aiData.className
            }).returning();
            classId = newClass[0].id;
        }

        // Insert Drug
        const drugId = crypto.randomUUID();
        await db.insert(drugs).values({
            id: drugId,
            brandName: aiData.brandName,
            genericName: aiData.genericName,
            manufacturerId: manufacturerId,
            classId: classId,
            description: aiData.indications,
            category: aiData.className,
            mechanismOfAction: aiData.mechanismOfAction,
            sideEffects: aiData.sideEffects,
            boxedWarning: aiData.boxedWarning,
            formula: aiData.formula,
            indicationsAndUsage: aiData.indications,
            dosageAndAdministration: aiData.dosage,
        });

        if (!firstCreatedDrugId) {
            firstCreatedDrugId = drugId;
        }
    }

    // 3. Update Request Status
    // We link the request to the FIRST created drug, but all are added to the library.
    console.log(`✅ Drugs created. Linking request to: ${firstCreatedDrugId}`);
    await db.update(drugRequests)
      .set({ 
        status: "approved", 
        updatedAt: new Date(),
        createdDrugId: firstCreatedDrugId 
      })
      .where(eq(drugRequests.id, requestId));

    revalidatePath("/admin/requests");
    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve request:", error);
    return { success: false, error: "Failed to approve request" };
  }
}

export async function rejectDrugRequest(requestId: string) {
  try {
    await db.update(drugRequests)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(drugRequests.id, requestId));

    revalidatePath("/admin/requests");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject request:", error);
    return { success: false, error: "Failed to reject request" };
  }
}

export async function deleteDrugRequest(requestId: string) {
  try {
    await db.delete(drugRequests).where(eq(drugRequests.id, requestId));
    revalidatePath("/admin/requests");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete request:", error);
    return { success: false, error: "Failed to delete request" };
  }
}

export async function banUser(userId: string) {
  try {
    // In a real app, you'd update a 'banned' or 'status' field
    // await db.update(users).set({ status: 'banned' }).where(eq(users.id, userId));
    console.log(`Banning user ${userId}`);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to ban user:", error);
    return { success: false, error: "Failed to ban user" };
  }
}

export async function promoteUser(userId: string, role: "leader" | "co-leader" | "member") {
  try {
    // await db.update(users).set({ role: 'admin' }).where(eq(users.id, userId));
    console.log(`Promoting user ${userId} to ${role}`);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to promote user:", error);
    return { success: false, error: "Failed to promote user" };
  }
}

export async function demoteUser(userId: string) {
  try {
    // await db.update(users).set({ role: 'user' }).where(eq(users.id, userId));
    console.log(`Demoting user ${userId}`);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to demote user:", error);
    return { success: false, error: "Failed to demote user" };
  }
}
export async function reviewCase(caseId: string, status: "approved" | "rejected") {
  try {
    await db.update(cases)
      .set({ status: status })
      .where(eq(cases.id, caseId));
    
    revalidatePath("/admin/cases");
    return { success: true };
  } catch (error) {
    console.error("Failed to review case:", error);
    return { success: false, error: "Failed to review case" };
  }
}

export async function unbanUser(userId: string) {
  try {
    // await db.update(users).set({ status: 'active' }).where(eq(users.id, userId));
    console.log(`Unbanning user ${userId}`);
    revalidatePath("/admin/users");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to unban user:", error);
    return { success: false, error: "Failed to unban user" };
  }
}
export async function searchLocalDrugs(query: string) {
  if (!query || query.length < 2) return [];
  
  try {
    const results = await db.query.drugs.findMany({
      where: or(
        like(drugs.brandName, `%${query}%`),
        like(drugs.genericName, `%${query}%`)
      ),
      limit: 5,
      with: {
        manufacturer: true,
        class: true,
      }
    });
    
    return results;
  } catch (error) {
    console.error("Failed to search local drugs:", error);
    return [];
  }
}

export async function addDrugDirectly(drugName: string) {
  try {
    // Create a dummy request first to track it
    const requestId = crypto.randomUUID();
    
    await db.insert(drugRequests).values({
        id: requestId,
        drugName: drugName,
        status: "pending",
        userId: null, // System added
    });

    // Reuse approve logic
    return await approveDrugRequest(requestId, drugName);

  } catch (error) {
    console.error("Failed to add drug directly:", error);
    return { success: false, error: "Failed to add drug directly" };
  }
}
