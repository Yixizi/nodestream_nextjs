import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/conponents/manual-trigger/executor";
import { HttpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/conponents/goole-form-trigger/executor";
import { StripeTriggerExecutor } from "@/features/triggers/conponents/stripe-trigger/executor";
import { GeminiExecutor } from "../components/gemini/executor";
import { DeepseekExecutor } from "../components/deepseek/executor";
import { DiscordExecutor } from "../components/discord/executor";
import { SlackExecutor } from "../components/slack/executor";

export const executorRegistr: Record<
  NodeType,
  NodeExecutor
> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: HttpRequestExecutor,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerExecutor,
  [NodeType.GEMINI]: GeminiExecutor,
  [NodeType.DEEPSEEK]: DeepseekExecutor,
  [NodeType.DISCORD]: DiscordExecutor,
  [NodeType.SLACK]: SlackExecutor,
};

export const getExecutor = (
  nodeType: NodeType
): NodeExecutor => {
  const executor = executorRegistr[nodeType];
  if (!executor) {
    throw new Error(`没有找到 ${nodeType} 的执行器`);
  }
  return executor;
};
