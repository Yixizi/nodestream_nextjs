"use client";

import { ErrorView, LoadingView } from "@/components/ui/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingView message="加载工作流中..." />;
};

export const EditorError = () => {
  return <ErrorView message="加载工作流失败，请重试" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  return <div>{JSON.stringify(workflow, null, 2)}</div>;
};
