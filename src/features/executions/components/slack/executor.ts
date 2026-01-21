import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

import Handlebars from "handlebars";

import { slackChannel } from "@/inngest/channel/slack";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const SlackExecutor: NodeExecutor<
  SlackData
> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("内容未配置");
  }
  const rawContent = Handlebars.compile(data.content)(
    context
  );
  const content = decode(rawContent);

  try {
    const reslut = await step.run(
      "slack-webhook",
      async () => {
        if (!data.webhookUrl) {
          await publish(
            slackChannel().status({
              nodeId,
              status: "error",
            })
          );
          throw new NonRetriableError("Webhook URL未配置");
        }
        await ky.post(data.webhookUrl, {
          json: {
            content: content,
          },
        });

        if (!data.variableName) {
          await publish(
            slackChannel().status({
              nodeId,
              status: "error",
            })
          );
          throw new NonRetriableError("变量名未配置");
        }

        return {
          ...context,
          [data.variableName]: {
            messageContent: content.slice(0, 2000),
          },
        };
      }
    );

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      })
    );

    return reslut;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
