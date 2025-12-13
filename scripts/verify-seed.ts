import { db } from "@/lib/db";
import { drugs, manufacturers, drugClasses } from "@/lib/db/schema";
import { count } from "drizzle-orm";

async function verify() {
  const [drugCount] = await db.select({ count: count() }).from(drugs);
  const [mfrCount] = await db.select({ count: count() }).from(manufacturers);
  const [classCount] = await db.select({ count: count() }).from(drugClasses);

  console.log("Verification Results:");
  console.log(`Drugs: ${drugCount.count}`);
  console.log(`Manufacturers: ${mfrCount.count}`);
  console.log(`Classes: ${classCount.count}`);
}

verify().catch(console.error);
