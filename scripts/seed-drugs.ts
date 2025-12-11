import { db } from "@/lib/db";
import { drugs, manufacturers, drugClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const FDA_API_URL = "https://api.fda.gov/drug/label.json";
const BATCH_SIZE = 20;
const TOTAL_DRUGS = 1000;
const DELAY_MS = 1000;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDrugs(skip: number, limit: number) {
  const url = `${FDA_API_URL}?search=openfda.brand_name:*+AND+openfda.generic_name:*&limit=${limit}&skip=${skip}`;
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch drugs: ${response.status} ${response.statusText} - ${text}`);
  }
  return response.json();
}

async function seed() {
  console.log("Starting drug seed...");

  let processedCount = 0;

  while (processedCount < TOTAL_DRUGS) {
    try {
      const data = await fetchDrugs(processedCount, BATCH_SIZE);
      const results = data.results;

      if (!results || results.length === 0) {
        console.log("No more results found.");
        break;
      }

      for (const result of results) {
        const openfda = result.openfda;
        
        // Skip if essential data is missing
        if (!openfda || !openfda.brand_name || !openfda.generic_name) {
            continue;
        }

        const brandName = openfda.brand_name[0];
        const genericName = openfda.generic_name[0];
        const manufacturerName = openfda.manufacturer_name ? openfda.manufacturer_name[0] : "Unknown Manufacturer";
        const className = openfda.pharm_class_epc ? openfda.pharm_class_epc[0] : (openfda.pharm_class_moa ? openfda.pharm_class_moa[0] : "Uncategorized");
        
        // 1. Handle Manufacturer
        let manufacturerId;
        const existingManufacturer = await db.query.manufacturers.findFirst({
            where: eq(manufacturers.name, manufacturerName)
        });

        if (existingManufacturer) {
            manufacturerId = existingManufacturer.id;
        } else {
            const newManufacturer = await db.insert(manufacturers).values({
                name: manufacturerName
            }).returning();
            manufacturerId = newManufacturer[0].id;
        }

        // 2. Handle Class
        let classId;
        const existingClass = await db.query.drugClasses.findFirst({
            where: eq(drugClasses.name, className)
        });

        if (existingClass) {
            classId = existingClass.id;
        } else {
            const newClass = await db.insert(drugClasses).values({
                name: className
            }).returning();
            classId = newClass[0].id;
        }

        // 3. Insert Drug
        // Check if drug exists (by ID or brand name to avoid dupes if re-running)
        // Using openfda.spl_id as stable ID if available, else generate one
        const drugId = openfda.spl_id ? openfda.spl_id[0] : crypto.randomUUID();
        
        const existingDrug = await db.query.drugs.findFirst({
            where: eq(drugs.id, drugId)
        });

        if (!existingDrug) {
            await db.insert(drugs).values({
                id: drugId,
                brandName: brandName,
                genericName: genericName,
                manufacturerId: manufacturerId,
                classId: classId,
                description: result.description ? result.description[0] : (result.indications_and_usage ? result.indications_and_usage[0] : "No description available."),
                category: className, // Keep for backward compatibility
                mechanismOfAction: result.mechanism_of_action ? result.mechanism_of_action[0] : null,
                sideEffects: result.adverse_reactions ? result.adverse_reactions[0] : null,
                boxedWarning: result.boxed_warning ? result.boxed_warning[0] : null,
                formula: result.active_ingredient ? result.active_ingredient[0] : null,
                indicationsAndUsage: result.indications_and_usage ? result.indications_and_usage[0] : null,
                dosageAndAdministration: result.dosage_and_administration ? result.dosage_and_administration[0] : null,
            });
        }
      }

      processedCount += results.length;
      console.log(`Processed ${processedCount} drugs...`);
      await delay(DELAY_MS);

    } catch (error) {
      console.error("Error fetching/processing batch:", error);
      // Wait a bit before retrying or just break if it's a hard error
      break;
    }
  }

  console.log("Drug seeding completed.");
}

seed().catch(console.error);
