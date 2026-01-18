import { InitialNode } from "@/components/initial-node";
import { DeepseekNode } from "@/features/executions/components/deepseek/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GoogleTriggerNode } from "@/features/triggers/conponents/goole-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/conponents/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/conponents/stripe-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.DEEPSEEK]: DeepseekNode,
} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents;
