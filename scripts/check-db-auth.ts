import 'dotenv/config';
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function check() {
  console.log("Checking DB tables...");
  const tables = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log("Tables:", tables.rows.map(r => r.name));

  console.log("\nChecking 'account' table info...");
  try {
    const info = await db.run(sql`PRAGMA table_info(account)`);
    console.log("Columns:", info.rows.map(r => r.name));
  } catch (e) {
    console.log("'account' table not found or error:", e);
  }

  console.log("\nChecking Environment Variables...");
  console.log("AUTH_GOOGLE_ID set:", !!process.env.AUTH_GOOGLE_ID);
  console.log("AUTH_GOOGLE_SECRET set:", !!process.env.AUTH_GOOGLE_SECRET);
  console.log("AUTH_SECRET set:", !!process.env.AUTH_SECRET);
  console.log("NEXTAUTH_URL set:", !!process.env.NEXTAUTH_URL); // Optional in V5 but good to check
}

check().catch(console.error);
