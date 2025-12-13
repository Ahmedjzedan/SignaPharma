import { db } from "@/lib/db";
import { drugs, manufacturers, drugClasses, savedDrugs } from "@/lib/db/schema";
import fs from "fs";
import path from "path";

async function seedFromBackup() {
  const backupPath = path.join(process.cwd(), "drugs-backup.json");
  
  if (!fs.existsSync(backupPath)) {
    console.error("Backup file not found at:", backupPath);
    return;
  }

  console.log("Reading backup file...");
  const fileContent = fs.readFileSync(backupPath, "utf-8");
  const backup = JSON.parse(fileContent);

  if (!backup.data) {
    console.error("Invalid backup format: missing 'data' property");
    return;
  }

  const { manufacturers: mfrs, drugClasses: classes, drugs: drugList } = backup.data;

  console.log(`Found ${mfrs.length} manufacturers, ${classes.length} classes, and ${drugList.length} drugs.`);

  console.log("Clearing existing data...");
  try {
    // Delete in order to respect foreign keys
    await db.delete(savedDrugs);
    await db.delete(drugs);
    await db.delete(manufacturers);
    await db.delete(drugClasses);
    console.log("Database cleared.");
  } catch (error) {
    console.error("Error clearing database:", error);
    return;
  }

  console.log("Seeding manufacturers...");
  if (mfrs.length > 0) {
    await db.insert(manufacturers).values(mfrs);
  }

  console.log("Seeding drug classes...");
  if (classes.length > 0) {
    await db.insert(drugClasses).values(classes);
  }

  console.log("Seeding drugs...");
  
  // Deduplicate drugs by ID
  const uniqueDrugs = new Map();
  for (const drug of drugList) {
    if (!uniqueDrugs.has(drug.id)) {
      uniqueDrugs.set(drug.id, drug);
    } else {
      console.warn(`Duplicate drug ID found: ${drug.id} (${drug.brandName}). Skipping.`);
    }
  }
  const uniqueDrugList = Array.from(uniqueDrugs.values());
  console.log(`Unique drugs count: ${uniqueDrugList.length}`);

  const CHUNK_SIZE = 50;
  for (let i = 0; i < uniqueDrugList.length; i += CHUNK_SIZE) {
    const chunk = uniqueDrugList.slice(i, i + CHUNK_SIZE).map((drug: any) => ({
      ...drug,
      createdAt: drug.createdAt ? new Date(drug.createdAt) : new Date(),
    }));
    await db.insert(drugs).values(chunk);
    console.log(`Inserted drugs ${i + 1} to ${Math.min(i + CHUNK_SIZE, uniqueDrugList.length)}`);
  }

  console.log("Seeding completed successfully!");
}

seedFromBackup().catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
