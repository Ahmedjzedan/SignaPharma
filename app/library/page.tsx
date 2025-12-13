import { db } from "@/lib/db";
import { drugs } from "@/lib/db/schema";
import LibraryContent, { Drug } from "./LibraryContent";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { savedDrugs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { getDrugColor } from "@/lib/utils";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  // Fetch only user's saved drugs
  const userDrugs = await db.query.savedDrugs.findMany({
    where: eq(savedDrugs.userId, session.user.id),
    with: {
      drug: {
        with: {
          manufacturer: true,
        }
      }
    }
  });

  // Map DB drugs to UI Drug interface
  const mappedDrugs: Drug[] = userDrugs.map(({ drug }) => ({
    id: drug.id,
    name: drug.brandName,
    class: drug.category || "Unknown Class",
    mastery: 0, // Default for now
    color: getDrugColor(drug.brandName),
    formula: drug.formula || "N/A",
    brands: drug.brandName,
    manufacturer: drug.manufacturer?.name || "N/A",
    warnings: drug.boxedWarning || drug.sideEffects || "N/A",
    indications: drug.indicationsAndUsage || drug.description || "N/A",
    moa: drug.mechanismOfAction || "N/A",
    dosage: drug.dosageAndAdministration || "N/A",
  }));

  // Fetch top doctors (users)
  const topDoctors = await db.query.users.findMany({
    limit: 6,
    orderBy: (users, { desc }) => [desc(users.xp)],
  });

  return <LibraryContent initialDrugs={mappedDrugs} topDoctors={topDoctors} />;
}
