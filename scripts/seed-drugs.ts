import { db } from "@/lib/db";
import { drugs, manufacturers, drugClasses, savedDrugs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const FDA_API_URL = "https://api.fda.gov/drug/label.json";
const DELAY_MS = 300; // Faster delay since we are targeting specific drugs

// Top ~300 Common Generic Drugs
const TOP_DRUGS = [
  "Atorvastatin", "Levothyroxine", "Lisinopril", "Metformin", "Amlodipine", 
  "Metoprolol", "Omeprazole", "Simvastatin", "Losartan", "Albuterol", 
  "Gabapentin", "Hydrochlorothiazide", "Acetaminophen", "Sertraline", "Fluticasone", 
  "Montelukast", "Furosemide", "Amoxicillin", "Pantoprazole", "Escitalopram", 
  "Alprazolam", "Prednisone", "Bupropion", "Pravastatin", "Citalopram", 
  "Amphetamine", "Ibuprofen", "Carvedilol", "Trazodone", "Fluoxetine", 
  "Tramadol", "Insulin", "Clonazepam", "Tamsulosin", "Atenolol", 
  "Potassium Chloride", "Meloxicam", "Rosuvastatin", "Clopidogrel", "Propranolol", 
  "Aspirin", "Cyclobenzaprine", "Glipizide", "Duloxetine", "Methylphenidate", 
  "Ranitidine", "Venlafaxine", "Zolpidem", "Warfarin", "Oxycodone", 
  "Ethinyl Estradiol", "Allopurinol", "Ergocalciferol", "Lorazepam", "Quetiapine", 
  "Estradiol", "Triamterene", "Glimepiride", "Spironolactone", "Ondansetron", 
  "Naproxen", "Divalproex", "Finasteride", "Cetirizine", "Topiramate", 
  "Cephalexin", "Esomeprazole", "Latanoprost", "Alendronate", "Diazepam", 
  "Pregabalin", "Methylprednisolone", "Levofloxacin", "Fenofibrate", "Mirtazapine", 
  "Folic Acid", "Risperidone", "Lamotrigine", "Sitagliptin", "Buspirone", 
  "Donepezil", "Tizanidine", "Lisdexamfetamine", "Celecoxib", "Aripiprazole", 
  "Oxybutynin", "Doxycycline", "Cyanocobalamin", "Hydralazine", "Valsartan", 
  "Lovastatin", "Diltiazem", "Famotidine", "Metronidazole", "Amitriptyline", 
  "Levetiracetam", "Nifedipine", "Ramipril", "Benzonatate", "Memantine", 
  "Sumatriptan", "Methotrexate", "Polyethylene Glycol", "Baclofen", "Hydroxyzine", 
  "Codeine", "Olanzapine", "Tolterodine", "Phentermine", "Verapamil", 
  "Promethazine", "Gemfibrozil", "Nitrofurantoin", "Oseltamivir", "Valacyclovir", 
  "Mupirocin", "Doxazosin", "Minocycline", "Thyroid", "Sildenafil", 
  "Clindamycin", "Ropinirole", "Budesonide", "Chlorhexidine", "Nystatin", 
  "Diclofenac", "Temazepam", "Hydrocortisone", "Dicyclomine", "Acyclovir", 
  "Isosorbide", "Benazepril", "Norgestimate", "Carbamazepine", "Lidocaine", 
  "Nortriptyline", "Mometasone", "Nebivolol", "Glyburide", "Medroxyprogesterone", 
  "Hydroxychloroquine", "Valproic Acid", "Clarithromycin", "Sucralfate", "Digoxin", 
  "Ketoconazole", "Prazosin", "Methocarbamol", "Penicillin", "Amiodarone", 
  "Lurasidone", "Terazosin", "Enalapril", "Timolol", "Pioglitazone", 
  "Benztropine", "Meclizine", "Lithium", "Primidone", "Sotalol", 
  "Colchicine", "Hydromorphone", "Rizatriptan", "Phenytoin", "Ofloxacin", 
  "Torsemide", "Cefdinir", "Adalimumab", "Etanercept", "Infliximab", 
  "Rituximab", "Bevacizumab", "Trastuzumab", "Pembrolizumab", "Nivolumab", 
  "Ipilimumab", "Atezolizumab"
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDrugData(drugName: string) {
  // Search specifically for this drug name in brand or generic fields
  // Using exact match logic if possible, or broad search
  const search = `openfda.brand_name:"${drugName}"+OR+openfda.generic_name:"${drugName}"`;
  const url = `${FDA_API_URL}?search=${search}&limit=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) return null; // Not found
        throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results ? data.results[0] : null;
  } catch (error) {
    console.error(`Error fetching ${drugName}:`, error);
    return null;
  }
}

async function seed() {
  console.log(`Starting TOP ${TOP_DRUGS.length} drug seed...`);

  // 1. Clear existing data
  console.log("Clearing existing drug data...");
  try {
    await db.delete(savedDrugs);
    await db.delete(drugs);
    await db.delete(manufacturers);
    await db.delete(drugClasses);
    console.log("Database cleared.");
  } catch (error) {
    console.error("Error clearing database:", error);
    return;
  }

  let savedCount = 0;

  for (const drugName of TOP_DRUGS) {
    try {
      const result = await fetchDrugData(drugName);
      
      if (!result) {
        console.log(`Skipping ${drugName} - Not found in FDA API`);
        continue;
      }

      const openfda = result.openfda;
      if (!openfda) {
         console.log(`Skipping ${drugName} - No openfda data`);
         continue;
      }

      // Extract Data with Fallbacks
      // We are less strict here because we WANT these specific drugs.
      // If data is missing, we fill with "Unknown" or null, and the Admin/Gemini can fix later.
      
      const brandName = openfda.brand_name ? openfda.brand_name[0] : drugName; // Fallback to our query name
      const genericName = openfda.generic_name ? openfda.generic_name[0] : drugName;
      const manufacturerName = openfda.manufacturer_name ? openfda.manufacturer_name[0] : "Unknown Manufacturer";
      const className = openfda.pharm_class_epc ? openfda.pharm_class_epc[0] : (openfda.pharm_class_moa ? openfda.pharm_class_moa[0] : "Uncategorized");
      
      const formula = result.active_ingredient ? result.active_ingredient[0] : (openfda.substance_name ? openfda.substance_name[0] : "Unknown Formula");
      const boxedWarning = result.boxed_warning ? result.boxed_warning[0] : "No Boxed Warning";
      const indications = result.indications_and_usage ? result.indications_and_usage[0] : "No indications available.";
      const moa = result.mechanism_of_action ? result.mechanism_of_action[0] : "Mechanism unknown.";
      const dosage = result.dosage_and_administration ? result.dosage_and_administration[0] : "See prescribing information.";
      const sideEffects = result.adverse_reactions ? result.adverse_reactions[0] : "See warnings.";

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
      const drugId = openfda.spl_id ? openfda.spl_id[0] : crypto.randomUUID();
      
      // Check for duplicates (by ID)
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
              description: indications.substring(0, 500) + "...", // Truncate for description
              category: className,
              mechanismOfAction: moa,
              sideEffects: sideEffects,
              boxedWarning: boxedWarning,
              formula: formula,
              indicationsAndUsage: indications,
              dosageAndAdministration: dosage,
          });
          savedCount++;
          console.log(`Saved: ${brandName} (${genericName})`);
      } else {
        console.log(`Skipping ${drugName} - Duplicate`);
      }

      await delay(DELAY_MS);

    } catch (error) {
      console.error(`Error processing ${drugName}:`, error);
    }
  }

  console.log(`Top drug seeding completed. Total saved: ${savedCount}/${TOP_DRUGS.length}`);
}

seed().catch(console.error);
