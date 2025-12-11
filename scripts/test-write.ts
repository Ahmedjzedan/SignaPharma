import { db } from "@/lib/db";
import { manufacturers } from "@/lib/db/schema";

async function main() {
  console.log("Attempting to write...");
  await db.insert(manufacturers).values({
    name: "Test Manufacturer " + Date.now()
  });
  console.log("Write successful.");
}

main().catch(console.error);
