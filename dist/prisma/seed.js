"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../lib/generated/prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting user seeding...");
    const totalUsers = 1000;
    const batchSize = 100;
    let created = 0;
    while (created < totalUsers) {
        const batch = Array.from({ length: batchSize }, () => ({
            name: faker_1.faker.person.fullName(),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number(),
            address: faker_1.faker.location.streetAddress(),
            country: faker_1.faker.location.country(),
            avatar: faker_1.faker.image.avatarGitHub(),
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
