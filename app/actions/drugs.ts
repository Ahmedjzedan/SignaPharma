"use server";

import { db } from "@/lib/db";
import { drugs, savedDrugs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveDrugToLibrary(drugData: any) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 1. Check if drug exists in global drugs table, if not create it
  const existingDrug = await db.query.drugs.findFirst({
    where: eq(drugs.id, drugData.id),
  });

  if (!existingDrug) {
    await db.insert(drugs).values({
      id: drugData.id,
      brandName: drugData.brand_name,
      genericName: drugData.generic_name,
      description: drugData.description,
      category: drugData.pharm_class[0] || "Uncategorized",
      imageUrl: null, // FDA API doesn't provide images easily
      mechanismOfAction: drugData.mechanism_of_action,
      sideEffects: drugData.warnings,
      boxedWarning: drugData.boxed_warning,
      formula: drugData.active_ingredient,
      indicationsAndUsage: drugData.indications_and_usage,
      dosageAndAdministration: drugData.dosage_and_administration,
    });
  }

  const userId = session.user.id;

  // 2. Save to user's library (saved_drugs)
  // Check if already saved
  const existingSave = await db.query.savedDrugs.findFirst({
    where: (saved, { and, eq }) => and(
      eq(saved.userId, userId),
      eq(saved.drugId, drugData.id)
    ),
  });

  if (!existingSave) {
    await db.insert(savedDrugs).values({
      id: crypto.randomUUID(),
      userId: userId,
      drugId: drugData.id,
    });
  }

  revalidatePath("/library");
  return { success: true };
}
