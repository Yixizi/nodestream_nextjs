import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { google } from "@ai-sdk/google";
export const appRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.auth.user;
  }),
  testAi: baseProcedure.mutation(async ({ ctx }) => {
    const result = await inngest.send({ name: "execute/ai" });
    console.log(result, "result");
    return { success: true };
  }),
  createWorkflow: baseProcedure.mutation(async ({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: "test",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
