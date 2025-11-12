import { betterAuth, z } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// // If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";
import prisma from "@/lib/db";

// const passwordSchema = z.string().min(1, "密码至少1位");
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 1,
  },
});
