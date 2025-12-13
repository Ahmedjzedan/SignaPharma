
import { db } from "@/lib/db";
import { drugs, manufacturers, drugClasses } from "@/lib/db/schema";
import fs from "fs/promises";
import path from "path";

async function main() {
  console.log("📦 Starting database backup...");

  try {
    // Fetch all data
    const allDrugs = await db.select().from(drugs);
    const allManufacturers = await db.select().from(manufacturers);
    const allClasses = await db.select().from(drugClasses);

    const backupData = {
      timestamp: new Date().toISOString(),
      counts: {
        drugs: allDrugs.length,
        manufacturers: allManufacturers.length,
        classes: allClasses.length,
      },
      data: {
        manufacturers: allManufacturers,
        drugClasses: allClasses,
        drugs: allDrugs,
      }
    };

    const outputPath = path.join(process.cwd(), "drugs-backup.json");
    
    await fs.writeFile(outputPath, JSON.stringify(backupData, null, 2));

    console.log(`✅ Backup successful!`);
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`   - Drugs: ${allDrugs.length}`);
    console.log(`   - Manufacturers: ${allManufacturers.length}`);
    console.log(`   - Drug Classes: ${allClasses.length}`);

  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  }
}

main();
