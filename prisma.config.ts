import { defineConfig, env } from "prisma/config";
import "dotenv/config";
import * as path from "node:path";

export default defineConfig({
  // The Rust-compiled schema engine
  engine: "classic",
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
