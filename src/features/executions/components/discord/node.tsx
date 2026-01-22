"use client";

import {
  Node,
  NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-executioon-node";
import {
  DiscordDialog,
  DiscordFormValues,
} from "@/features/executions/components/discord/dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channel/discord";
import { fetchDiscordToken } from "./actions";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeDataProps = Node<DiscordNodeData>;

export const DiscordNode = memo(
  (props: NodeProps<DiscordNodeDataProps>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: DISCORD_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchDiscordToken,
    });

    const nodeData = props.data;
    const description = nodeData?.content
      ? `发送: ${nodeData.content.slice(0, 50)}...`
      : "未配置";

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    const handleSubmit = (values: DiscordFormValues) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === props.id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            };
          }
          return node;
        })
      );
    };

    return (
      <>
        <DiscordDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={"/logos/discord.svg"}
          name="Discord"
          description={description}
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

DiscordNode.displayName = "DiscordNode";
