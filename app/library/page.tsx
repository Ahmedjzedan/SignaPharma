import { db } from "@/lib/db";
import { drugs } from "@/lib/db/schema";
import LibraryContent, { Drug } from "./LibraryContent";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { savedDrugs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  // Fetch only user's saved drugs
  const userDrugs = await db
    .select({
      drug: drugs,
    })
    .from(savedDrugs)
    .innerJoin(drugs, eq(savedDrugs.drugId, drugs.id))
    .where(eq(savedDrugs.userId, session.user.id));

  // Map DB drugs to UI Drug interface
  const mappedDrugs: Drug[] = userDrugs.map(({ drug }) => ({
    id: drug.id,
    name: drug.brandName,
    class: drug.category || "Unknown Class",
    mastery: 0, // Default for now
    color: "blue",
    formula: "N/A",
    brands: "N/A",
    manufacturer: "N/A",
    warnings: drug.sideEffects || "N/A",
    indications: drug.description || "N/A",
    moa: drug.mechanismOfAction || "N/A",
    dosage: "N/A",
  }));

  // Fetch top doctors (users)
  const topDoctors = await db.query.users.findMany({
    limit: 6,
    orderBy: (users, { desc }) => [desc(users.xp)],
  });

  return <LibraryContent initialDrugs={mappedDrugs} topDoctors={topDoctors} />;
}
