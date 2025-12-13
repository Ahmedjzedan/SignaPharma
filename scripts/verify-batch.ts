import { db } from "@/lib/db";
import { drugBatches, drugRequests, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function verifyBatching() {
  console.log("🧪 Verifying Batching Schema...");

  // 1. Create a dummy request
  const user = await db.query.users.findFirst();
  if (!user) throw new Error("No user found");

  const [request] = await db.insert(drugRequests).values({
    userId: user.id,
    drugName: "Test Drug for Batch",
    status: "pending",
  }).returning();
  console.log("✅ Created request:", request.id);

  // 2. Create a batch
  const [batch] = await db.insert(drugBatches).values({
    status: "open",
  }).returning();
  console.log("✅ Created batch:", batch.id);

  // 3. Link request to batch
  await db.update(drugRequests)
    .set({ batchId: batch.id })
    .where(eq(drugRequests.id, request.id));
  console.log("✅ Linked request to batch");

  // 4. Verify link
  const updatedRequest = await db.query.drugRequests.findFirst({
    where: eq(drugRequests.id, request.id),
    with: {
      batch: true,
    }
  });

  if (updatedRequest?.batch?.id === batch.id) {
    console.log("✅ Verification Successful: Request is linked to batch.");
  } else {
    console.error("❌ Verification Failed: Request not linked correctly.");
  }

  // Cleanup
  await db.delete(drugRequests).where(eq(drugRequests.id, request.id));
  await db.delete(drugBatches).where(eq(drugBatches.id, batch.id));
}

verifyBatching().catch(console.error);
