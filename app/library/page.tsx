import { db } from "@/lib/db";
import { drugs } from "@/lib/db/schema";
import LibraryContent, { Drug } from "./LibraryContent";

export default async function LibraryPage() {
  // Fetch all drugs from the database
  // In a real app, we would join with savedDrugs to get only the user's drugs
  // For now, we'll just fetch all drugs to verify the connection
  const dbDrugs = await db.select().from(drugs);

  // Map DB drugs to UI Drug interface
  const mappedDrugs: Drug[] = dbDrugs.map((d) => ({
    id: d.id,
    name: d.name,
    class: d.category, // Mapping category to class
    mastery: 0, // Default for now
    color: "blue", // Default for now, could be mapped from category
    formula: "N/A", // Not in DB yet
    brands: "N/A", // Not in DB yet
    manufacturer: "N/A", // Not in DB yet
    warnings: d.sideEffects || "N/A", // Using sideEffects as warnings for now
    indications: d.description, // Using description as indications
    moa: d.mechanismOfAction || "N/A",
    dosage: "N/A", // Not in DB yet
  }));

  // Fetch top doctors (users)
  const topDoctors = await db.query.users.findMany({
    limit: 6,
    orderBy: (users, { desc }) => [desc(users.xp)],
  });

  return <LibraryContent initialDrugs={mappedDrugs} topDoctors={topDoctors} />;
}
