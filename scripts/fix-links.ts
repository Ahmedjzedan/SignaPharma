
import { db } from "@/lib/db";
import { drugRequests, drugs } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";

async function main() {
  console.log("🔍 Checking for approved requests with missing links...");

  const orphanRequests = await db.query.drugRequests.findMany({
    where: (table, { and, eq, isNull }) => and(
      eq(table.status, "approved"),
      isNull(table.createdDrugId)
    )
  });

  console.log(`Found ${orphanRequests.length} orphan requests.`);

  for (const request of orphanRequests) {
    console.log(`Processing request: ${request.drugName} (${request.id})`);
    
    // Find matching drug by name (brand or generic) - simple fuzzy match or exact match
    // Since we create it with the name from Gemini, it might vary slightly, but let's try exact match on brandName first, then generic.
    // Actually, the request.drugName is what we sent to Gemini. Gemini returned brandName.
    // Let's try to find a drug where brandName or genericName contains the request string?
    // Or just look for ANY drug created recently?
    
    // Let's try to find a drug with the same name as the request first (case insensitive)
    const matchingDrug = await db.query.drugs.findFirst({
        where: (table, { or, like }) => or(
            like(table.brandName, `%${request.drugName}%`),
            like(table.genericName, `%${request.drugName}%`)
        )
    });

    if (matchingDrug) {
        console.log(`✅ Found matching drug: ${matchingDrug.brandName} (${matchingDrug.id})`);
        await db.update(drugRequests)
            .set({ createdDrugId: matchingDrug.id })
            .where(eq(drugRequests.id, request.id));
        console.log("🔗 Linked successfully.");
    } else {
        console.log("❌ No matching drug found in library.");
    }
  }
  
  console.log("Done.");
}

main().catch(console.error);
