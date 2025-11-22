import { eq } from "drizzle-orm";

import { db } from "./src/client";
import { listing, university, user } from "./src/schema";

const SEED_UNIVERSITY_ID = "seed-university-ui";
const SEED_USER_ID = "seed-user-budi";

const LISTINGS_DATA = [
  {
    title: "Batik Shirt Men - Size L",
    description:
      "Authentic Batik Solo, barely worn. Perfect for formal events or casual Fridays.",
    price: 150000,
    category: "CLOTHING",
    condition: "LIKE_NEW",
  },
  {
    title: "Indomie Goreng - 1 Carton (40 packs)",
    description:
      "Unopened carton of Indomie Goreng. Best before 2026. Student essential!",
    price: 110000,
    category: "OTHER",
    condition: "NEW",
  },
  {
    title: "Calculus 1 Textbook (Bahasa Indonesia)",
    description:
      "Kalkulus Edisi 9, Jilid 1. Good condition, some highlighting.",
    price: 250000,
    category: "BOOKS",
    condition: "GOOD",
  },
  {
    title: "Preloved Kebaya Modern",
    description: "Beautiful pink kebaya, used once for graduation. Size M.",
    price: 350000,
    category: "CLOTHING",
    condition: "LIKE_NEW",
  },
  {
    title: "Angklung Set (Educational)",
    description: "Small angklung set, great for music class or decoration.",
    price: 75000,
    category: "OTHER",
    condition: "GOOD",
  },
  {
    title: "Logitech Mouse M331 Silent",
    description: "Wireless silent mouse, black. Works perfectly.",
    price: 120000,
    category: "ELECTRONICS",
    condition: "GOOD",
  },
  {
    title: "Wooden Desk (Meja Belajar)",
    description: "Sturdy wooden desk, teak wood. Must pick up from dorm.",
    price: 500000,
    category: "FURNITURE",
    condition: "FAIR",
  },
  {
    title: "Scientific Calculator Casio fx-991EX",
    description: "ClassWiz series, essential for engineering students.",
    price: 200000,
    category: "STATIONERY",
    condition: "GOOD",
  },
  {
    title: "Portable Fan (Kipas Angin Portable)",
    description: "Rechargeable fan, lifesaver for hot Jakarta days.",
    price: 35000,
    category: "ELECTRONICS",
    condition: "GOOD",
  },
  {
    title: "Plastic Container Set (Tupperware)",
    description: "Set of 3 containers, never used.",
    price: 50000,
    category: "OTHER",
    condition: "NEW",
  },
] as const;

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Ensure University exists
  console.log("Checking University...");
  const existingUni = await db.query.university.findFirst({
    where: eq(university.id, SEED_UNIVERSITY_ID),
  });

  if (!existingUni) {
    console.log("Creating Seed University...");
    await db.insert(university).values({
      id: SEED_UNIVERSITY_ID,
      name: "Universitas Indonesia",
      abbr: "UI",
      domain: "@ui.ac.id",
    });
  } else {
    console.log("Seed University already exists.");
  }

  // 2. Ensure User exists
  console.log("Checking User...");
  const existingUser = await db.query.user.findFirst({
    where: eq(user.id, SEED_USER_ID),
  });

  if (!existingUser) {
    console.log("Creating Seed User...");
    await db.insert(user).values({
      id: SEED_USER_ID,
      name: "Budi Santoso",
      email: "budi@ui.ac.id",
      emailVerified: true,
      role: "user",
      universityId: SEED_UNIVERSITY_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    console.log("Seed User already exists.");
  }

  // 3. Create Listings
  console.log("Creating Listings...");
  const listingsToInsert = LISTINGS_DATA.map((item) => ({
    sellerId: SEED_USER_ID,
    universityId: SEED_UNIVERSITY_ID,
    title: item.title,
    description: item.description,
    price: item.price,
    category: item.category,
    condition: item.condition,
    status: "ACTIVE" as const,
  }));

  await db.insert(listing).values(listingsToInsert);

  console.log(`✅ Seeded ${listingsToInsert.length} listings!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
