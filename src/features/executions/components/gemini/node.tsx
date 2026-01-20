"use client";

import {
  Node,
  NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-executioon-node";
import {
  GeminiFormValues,
  GeminiDialog,
} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiToken } from "./actions";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channel/gemini";

type GeminiNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

type GeminiNodeDataProps = Node<GeminiNodeData>;

export const GeminiNode = memo(
  (props: NodeProps<GeminiNodeDataProps>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: GEMINI_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchGeminiToken,
    });

    const nodeData = props.data;
    const description = nodeData?.userPrompt
      ? `gemini-2.0-flash: ${nodeData.userPrompt.slice(
          0,
          50
        )}...`
      : "未配置";

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    const handleSubmit = (values: GeminiFormValues) => {
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
        <GeminiDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={"/logos/gemini.svg"}
          name="Gemini"
          description={description}
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

GeminiNode.displayName = "GeminiNode";
