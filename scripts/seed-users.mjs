import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // MUST be service role
);

async function seed() {
  console.log("🌱 Starting user seeding...");

  const totalUsers = 100000;
  const batchSize = 100;
  let created = 0;

  while (created < totalUsers) {
    const batch = Array.from({ length: batchSize }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      country: faker.location.country(),
      avatar: faker.image.avatarGitHub(),

      username: faker.internet.username(),
      password: faker.internet.password(),

      birthdate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      gender: faker.helpers.arrayElement(["male", "female", "other"]),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      company: faker.company.name(),
      jobtitle: faker.person.jobTitle(),
      website: faker.internet.url(),
      bio: faker.lorem.sentence(),
      interests: faker.helpers
        .arrayElements(["sports", "music", "tech", "art", "travel", "food"], 2)
        .join(", "),
      language: faker.helpers.arrayElement([
        "English",
        "Spanish",
        "French",
        "German",
        "Arabic",
        "Chinese",
      ]),
      timezone: faker.location.timeZone(),
      ipaddress: faker.internet.ip(),
      latitude: Number(faker.location.latitude()),
      longitude: Number(faker.location.longitude()),
      lastlogin: faker.date.recent({ days: 10 }),
      createdat: faker.date.past({ years: 1 }),
      updatedat: new Date(),
    }));

    const { error } = await supabase
      .from("users")
      .upsert(batch, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
      console.error("❌ Error inserting batch:", error);
      process.exit(1);
    }

    created += batch.length;
    console.log(`✅ Inserted ${created} users...`);
  }

  console.log("🎉 Seeding completed!");
}

seed();
