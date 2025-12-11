"use server";

import { db } from "@/lib/db";
import { savedDrugs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteDrugFromLibrary(drugId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.delete(savedDrugs).where(
    and(
      eq(savedDrugs.userId, session.user.id),
      eq(savedDrugs.drugId, drugId)
    )
  );

  revalidatePath("/library");
  return { success: true };
}
