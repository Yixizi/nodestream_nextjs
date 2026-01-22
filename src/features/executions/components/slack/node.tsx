"use client";

import {
  Node,
  NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-executioon-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackToken } from "./actions";
import { SlackDialog, SlackFormValues } from "./dialog";
import { SLACK_CHANNEL_NAME } from "@/inngest/channel/slack";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
};

type SlackNodeDataProps = Node<SlackNodeData>;

export const SlackNode = memo(
  (props: NodeProps<SlackNodeDataProps>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: SLACK_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchSlackToken,
    });

    const nodeData = props.data;
    const description = nodeData?.content
      ? `发送: ${nodeData.content.slice(0, 50)}...`
      : "未配置";

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    const handleSubmit = (values: SlackFormValues) => {
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
        <SlackDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={"/logos/slack.svg"}
          name="Slack"
          description={description}
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

SlackNode.displayName = "SlackNode";
