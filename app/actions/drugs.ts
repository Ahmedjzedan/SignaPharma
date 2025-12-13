"use server";

import { db } from "@/lib/db";
import { drugs, savedDrugs, users } from "@/lib/db/schema";
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

export async function getRandomDrug() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // 1. Get IDs of drugs the user ALREADY has
  const userDrugs = await db.query.savedDrugs.findMany({
    where: eq(savedDrugs.userId, userId),
    columns: {
      drugId: true,
    },
  });

  const userDrugIds = userDrugs.map((d) => d.drugId);

  // 2. Fetch ALL drugs (or a large sample)
  // Ideally, we would do a "NOT IN" query, but Drizzle's `notInArray` needs a non-empty array.
  // If user has NO drugs, we just pick any.
  
  let availableDrugs;
  
  if (userDrugIds.length > 0) {
    // Fetch drugs NOT in the user's list
    // Note: If the list is huge, this might be inefficient, but for < 1000 drugs it's fine.
    const validUserDrugIds = userDrugIds.filter((id): id is string => id !== null);
    availableDrugs = await db.query.drugs.findMany({
      where: (drugs, { notInArray }) => notInArray(drugs.id, validUserDrugIds),
    });
  } else {
    availableDrugs = await db.query.drugs.findMany();
  }

  if (availableDrugs.length === 0) {
    return null; // User has all drugs!
  }

  // 3. Pick one random drug
  const randomIndex = Math.floor(Math.random() * availableDrugs.length);
  const randomDrug = availableDrugs[randomIndex];

  return {
    id: randomDrug.id,
    brand_name: randomDrug.brandName,
    generic_name: randomDrug.genericName,
    manufacturer_name: "Unknown", // Or fetch relation
    pharm_class: [randomDrug.category || "Uncategorized"],
    description: randomDrug.description,
    mechanism_of_action: randomDrug.mechanismOfAction,
    warnings: randomDrug.sideEffects,
    indications_and_usage: randomDrug.indicationsAndUsage,
    dosage_and_administration: randomDrug.dosageAndAdministration,
    active_ingredient: randomDrug.formula,
  };
}

export async function getLibraryStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Count saved drugs
  const savedCount = await db.query.savedDrugs.findMany({
    where: eq(savedDrugs.userId, userId),
  });

  // Count total drugs in DB
  const totalDrugs = await db.query.drugs.findMany(); // Or use count() query for efficiency

  // Get user stats (streak)
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      streak: true,
    },
  });

  // Mocked stats for now (mastered/streak) as they depend on other logic
  return {
    collected: savedCount.length,
    total: totalDrugs.length,
    mastered: 0, // Placeholder
    streak: user?.streak || 0,
  };
}
