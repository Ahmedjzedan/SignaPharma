import { searchDrugs } from "@/app/actions/fda";

async function main() {
  console.log("Searching for 'Lisinopril'...");
  const results1 = await searchDrugs("Lisinopril");
  console.log(`Found ${results1.length} results.`);
  if (results1.length > 0) {
    console.log("First result:", JSON.stringify(results1[0], null, 2));
  }

  console.log("\nSearching for 'Betadine'...");
  const results2 = await searchDrugs("Betadine");
  console.log(`Found ${results2.length} results.`);
  if (results2.length > 0) {
    console.log("First result:", JSON.stringify(results2[0], null, 2));
  }
}

main().catch(console.error);
