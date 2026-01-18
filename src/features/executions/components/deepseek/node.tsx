"use client";

import {
  Node,
  NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-executioon-node";
import {
  DeepseekDialog,
  DeepseekFormValues,
} from "@/features/executions/components/deepseek/dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channel/deepseek";
import { fetchDeepseekToken } from "./actions";

type DeepseekNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type DeepseekNodeDataProps = Node<DeepseekNodeData>;

export const DeepseekNode = memo(
  (props: NodeProps<DeepseekNodeDataProps>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: DEEPSEEK_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchDeepseekToken,
    });

    const nodeData = props.data;
    const description = nodeData?.userPrompt
      ? `deepseek-chat: ${nodeData.userPrompt.slice(
          0,
          50
        )}...`
      : "未配置";

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    const handleSubmit = (values: DeepseekFormValues) => {
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
        <DeepseekDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={"/logos/deepseek.svg"}
          name="Deepseek"
          description={description}
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

DeepseekNode.displayName = "DeepseekNode";
