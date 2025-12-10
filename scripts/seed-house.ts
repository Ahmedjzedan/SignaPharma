
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const HOUSE_CREW = [
  {
    id: "house",
    name: "Dr. Gregory House",
    email: "house@ppth.org",
    image: "/avatars/house.png",
    role: "pharmacist",
    xp: 50000,
    streak: 100,
    elo: 2500,
    rank: "Diagnostician",
    bio: "Everybody lies. I don't care about the patients, I care about the puzzle. Head of Diagnostic Medicine.",
    title: "Head of Diagnostic Medicine",
    linkedin: "https://linkedin.com/in/gregory-house",
  },
  {
    id: "wilson",
    name: "Dr. James Wilson",
    email: "wilson@ppth.org",
    image: "/avatars/wilson.png",
    role: "pharmacist",
    xp: 45000,
    streak: 80,
    elo: 2200,
    rank: "Oncologist",
    bio: "I'm not an enabler. I just... help him. Head of Oncology.",
    title: "Head of Oncology",
  },
  {
    id: "cuddy",
    name: "Dr. Lisa Cuddy",
    email: "cuddy@ppth.org",
    image: "/avatars/cuddy.png",
    role: "admin",
    xp: 48000,
    streak: 90,
    elo: 2300,
    rank: "Dean of Medicine",
    bio: "I run this hospital. That means I run House. Theoretically.",
    title: "Dean of Medicine",
  },
  {
    id: "foreman",
    name: "Dr. Eric Foreman",
    email: "foreman@ppth.org",
    image: "/avatars/forman.png",
    role: "pharmacist",
    xp: 40000,
    streak: 60,
    elo: 2100,
    rank: "Neurologist",
    bio: "I am not House. I just want to be right.",
    title: "Neurologist",
  },
  {
    id: "chase",
    name: "Dr. Robert Chase",
    email: "chase@ppth.org",
    image: "/avatars/chas.png",
    role: "pharmacist",
    xp: 38000,
    streak: 50,
    elo: 2000,
    rank: "Intensivist",
    bio: "Did you try the medicine drug?",
    title: "Intensivist",
  },
  {
    id: "cameron",
    name: "Dr. Allison Cameron",
    email: "cameron@ppth.org",
    image: "/avatars/cameron.png",
    role: "pharmacist",
    xp: 39000,
    streak: 55,
    elo: 2050,
    rank: "Immunologist",
    bio: "People choose the paths that grant them the greatest rewards for the least amount of effort.",
    title: "Immunologist",
  },
  {
    id: "thirteen",
    name: "Dr. Remy Hadley",
    email: "thirteen@ppth.org",
    image: "/avatars/13.png",
    role: "pharmacist",
    xp: 35000,
    streak: 40,
    elo: 1900,
    rank: "Internist",
    bio: "I don't need to know everything. Just enough to save the patient.",
    title: "Internist",
  },
];

async function seedHouseCrew() {
  console.log("Seeding House M.D. Crew...");

  for (const char of HOUSE_CREW) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, char.email),
    });

    if (!existing) {
      await db.insert(users).values({
        id: char.id, // Manually setting ID for easy routing
        name: char.name,
        email: char.email,
        image: char.image,
        role: char.role as "student" | "pharmacist" | "admin",
        xp: char.xp,
        streak: char.streak,
        elo: char.elo,
        rank: char.rank,
        bio: char.bio,
        linkedin: char.linkedin,
        // Using current time for created_at default
      });
      console.log(`Created ${char.name}`);
    } else {
      console.log(`${char.name} already exists. Updating...`);
      await db.update(users).set({
        name: char.name,
        image: char.image,
        role: char.role as "student" | "pharmacist" | "admin",
        xp: char.xp,
        streak: char.streak,
        elo: char.elo,
        rank: char.rank,
        bio: char.bio,
        linkedin: char.linkedin,
      }).where(eq(users.email, char.email));
    }
  }

  console.log("Seeding complete!");
}

seedHouseCrew().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
