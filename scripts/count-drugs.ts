import { db } from "@/lib/db";
import { drugs } from "@/lib/db/schema";
import { count } from "drizzle-orm";

async function main() {
  const result = await db.select({ count: count() }).from(drugs);
  console.log(`Total drugs: ${result[0].count}`);
}

main().catch(console.error);
