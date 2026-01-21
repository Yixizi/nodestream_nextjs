import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

import Handlebars from "handlebars";

import { discordChannel } from "@/inngest/channel/discord";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const DiscordExecutor: NodeExecutor<
  DiscordData
> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      discordChannel().status({
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

  const username = data.username
    ? decode(data.username)
    : "工作流机器人";

  try {
    const reslut = await step.run(
      "discord-webhook",
      async () => {
        if (!data.webhookUrl) {
          await publish(
            discordChannel().status({
              nodeId,
              status: "error",
            })
          );
          throw new NonRetriableError("Webhook URL未配置");
        }
        await ky.post(data.webhookUrl, {
          json: {
            content: content.slice(0, 2000),
            username,
          },
        });

        if (!data.variableName) {
          await publish(
            discordChannel().status({
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
      discordChannel().status({
        nodeId,
        status: "success",
      })
    );

    return reslut;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
