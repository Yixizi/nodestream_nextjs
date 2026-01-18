import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createDeepSeek } from "@ai-sdk/deepseek";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { deepseekChannel } from "@/inngest/channel/deepseek";

Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type DeepseekData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const DeepseekExecutor: NodeExecutor<
  DeepseekData
> = async ({ data, nodeId, context, step, publish }) => {
  await publish(
    deepseekChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      deepseekChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("变量名未配置");
  }

  if (!data.userPrompt) {
    await publish(
      deepseekChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("用户提示词未配置");
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "你是一个助手，请根据用户的问题给出回答。";

  const userPrompt = Handlebars.compile(data.userPrompt)(
    context
  );

  const credentialValue = process.env.DEEPSEEK_API_KEY;
  if (!credentialValue) {
    await publish(
      deepseekChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError(
      "DEEPSEEK_API_KEY is not set"
    );
  }
  const deepseek = createDeepSeek({
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap(
      "deepseek-generate-text",
      generateText,
      {
        model: deepseek("deepseek-chat"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const text =
      steps[0].content[0].type === "text"
        ? steps[0].content[0].text
        : "";

    await publish(
      deepseekChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      deepseekChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
