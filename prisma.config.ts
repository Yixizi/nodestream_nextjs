import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config(); // 确保 .env 中的变量可用

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
