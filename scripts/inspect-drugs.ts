import { db } from "@/lib/db";
import { drugs, manufacturers, drugClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const result = await db.query.drugs.findMany({
    limit: 5,
    with: {
      manufacturer: true,
      class: true // Note: 'class' might be a reserved word or mapped differently in relations
    }
  });
  
  // Since I didn't define relations in schema.ts for the new tables yet (oops), I should do that or just query raw.
  // I'll just query raw for now or update schema relations.
  // Actually, I didn't update relations in schema.ts!
  // I added the tables and FK columns, but didn't add the `relations` definitions.
  // So `with` won't work.
  // I should update schema.ts to include relations if I want to use them in the app.
  // But for now, I'll just query drugs and print them.
  
  const drugsList = await db.select().from(drugs).limit(5);
  console.log(JSON.stringify(drugsList, null, 2));
}

main().catch(console.error);
