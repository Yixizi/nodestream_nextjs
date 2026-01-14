"use client";

import {
  Node,
  NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-executioon-node";
import { GlobeIcon } from "lucide-react";
import {
  HttpRequestFormValues,
  HttpRequestDialog,
} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchHttpRequestToken } from "./actions";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channel/http-request";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeProps = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo(
  (props: NodeProps<HttpRequestNodeProps>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: HTTP_REQUEST_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchHttpRequestToken,
    });

    const nodeData = props.data;
    const description = nodeData?.endpoint
      ? `请求 ${nodeData.endpoint || "GET"}`
      : "无请求地址";

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    const handleSubmit = (
      values: HttpRequestFormValues
    ) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === props.id) {
            return {
              ...node,
              data: {
                ...node.data,
                endpoint: values.endpoint,
                method: values.method,
                body: values.body,
                variableName: values.variableName,
              },
            };
          }
          return node;
        })
      );
    };

    return (
      <>
        <HttpRequestDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={GlobeIcon}
          name="HTTP请求"
          description={description}
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

HttpRequestNode.displayName = "HttpRequestNode";
