import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting user seeding...");

  const totalUsers = 100000;
  const batchSize = 100;
  let created = 0;

  while (created < totalUsers) {
    const batch = Array.from({ length: batchSize }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      country: faker.location.country(),
      avatar: faker.image.avatarGitHub(),

      username: faker.internet.username(), // ✅ fixed here
      password: faker.internet.password(), // ✅ still valid
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      gender: faker.helpers.arrayElement(["male", "female", "other"]),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      company: faker.company.name(),
      jobTitle: faker.person.jobTitle(),
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
      ipAddress: faker.internet.ip(),
      latitude: Number(faker.location.latitude()),
      longitude: Number(faker.location.longitude()),
      lastLogin: faker.date.recent({ days: 10 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    }));

    await prisma.user.createMany({ data: batch, skipDuplicates: true });

    created += batch.length;
    console.log(`✅ Inserted ${created} users...`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
