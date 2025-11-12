import prisma from "@/lib/db";
import { inngest } from "./client";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    Sentry.logger.info('调用成功', { log_source: 'sentry_test' })

    const { steps: geminiSteps } = await step.ai.wrap(
      "deepseek-generate-text",
      generateText,
      {
        model: deepseek("deepseek-chat"),
        system: "你是助手，请根据用户的问题生成一个回答。",
        prompt: "4 + 5= ?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );
    
    console.warn("未找到某些东西");
    console.error("遇见了某些错误");
    console.log(geminiSteps, "调用成功");
    return { geminiSteps };
  }
);
