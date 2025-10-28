import { PrismaClient } from "@/prisma/generated/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = new Map<string, any>(); // Use Map to ensure unique emails

  while (users.size < 10000) {
    const email = faker.internet.email();

    if (!users.has(email)) {
      users.set(email, {
        name: faker.person.fullName(),
        email,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        country: faker.location.country(),
        avatar: faker.image.avatar(),
      });
    }

    // Insert in batches of 1000
    if (users.size % 1000 === 0) {
      await prisma.user.createMany({ data: Array.from(users.values()) });
      console.log(`${users.size} users created`);
      users.clear();
    }
  }

  // Insert remaining users
  if (users.size > 0) {
    await prisma.user.createMany({ data: Array.from(users.values()) });
  }

  console.log("Seeding completed!");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
