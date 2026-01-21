import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import type { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channel/http-request";
import { manualTriggerChannel } from "./channel/manual-trigger";
import { googleFormTriggerChannel } from "./channel/google-form-trigger";
import { stripeTriggerChannel } from "./channel/stripe-trigger";
import { geminiChannel } from "./channel/gemini";
import { deepseekChannel } from "./channel/deepseek";
import { slackChannel } from "./channel/slack";
import { discordChannel } from "./channel/discord";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      deepseekChannel(),
      slackChannel(),
      discordChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    // 接收工作流 ID
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("工作流 ID 未获取到");
    }

    const sortedNodes = await step.run(
      "prepare-workflow",
      async () => {
        const workflow =
          await prisma.workflow.findUniqueOrThrow({
            where: {
              id: workflowId,
            },
            include: {
              nodes: true,
              connections: true,
            },
          });

        return topologicalSort(
          workflow.nodes,
          workflow.connections
        );
      }
    );

    const userId = await step.run(
      "get-user-id",
      async () => {
        const workflow =
          await prisma.workflow.findUniqueOrThrow({
            where: {
              id: workflowId,
            },
            select: {
              userId: true,
            },
          });

        return workflow.userId;
      }
    );

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        userId,
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        step,
        context,
        publish,
      });
    }
    return { result: context, workflowId };
  }
);
