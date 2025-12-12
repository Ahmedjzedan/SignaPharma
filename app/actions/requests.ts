"use server";

import { db } from "@/lib/db";
import { drugRequests } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function requestDrug(drugName: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!drugName || drugName.trim().length < 2) {
    throw new Error("Invalid drug name");
  }

  try {
    await db.insert(drugRequests).values({
      userId: session.user.id,
      drugName: drugName.trim(),
    });

    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("Failed to request drug:", error);
    return { success: false, error: "Failed to submit request" };
  }
}
