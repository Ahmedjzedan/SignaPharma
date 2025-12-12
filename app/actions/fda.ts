"use server";

const FDA_API_KEY = "lwfUo9QPacrII378TawDhwisandz9CRPahEkssuq";
const BASE_URL = "https://api.fda.gov/drug/label.json";

export interface FDADrugResult {
  id: string;
  brand_name: string;
  generic_name: string;
  manufacturer_name: string;
  pharm_class: string[];
  description: string;
  mechanism_of_action: string;
  warnings: string;
  indications_and_usage: string;
  dosage_and_administration: string;
  active_ingredient: string;
}

import { db } from "@/lib/db";
import { drugs } from "@/lib/db/schema";
import { or, like } from "drizzle-orm";

export async function searchDrugs(query: string): Promise<FDADrugResult[]> {
  if (!query || query.length < 3) return [];

  try {
    // Prioritize brand name matches
    const results = await db.query.drugs.findMany({
      where: or(
        like(drugs.brandName, `%${query}%`),
        like(drugs.genericName, `%${query}%`)
      ),
      limit: 20, // Fetch more to filter client-side if needed, though we do it here
      orderBy: (drugs, { asc }) => [asc(drugs.brandName)], // Sort by brand name
    });

    return results.map((item) => ({
      id: item.id,
      brand_name: item.brandName,
      generic_name: item.genericName,
      manufacturer_name: "Unknown Manufacturer", // We could fetch this if we included relations
      pharm_class: [item.category || "Uncategorized"],
      description: item.description || "No description available.",
      mechanism_of_action: item.mechanismOfAction || "N/A",
      warnings: item.sideEffects || item.boxedWarning || "N/A",
      indications_and_usage: item.indicationsAndUsage || "N/A",
      dosage_and_administration: item.dosageAndAdministration || "N/A",
      active_ingredient: item.formula || "N/A",
    }));
  } catch (error) {
    console.error("Local DB Search Error:", error);
    return [];
  }
}
