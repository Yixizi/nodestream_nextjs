import type { GetStepTools, Inngest } from "inngest";

export type ExecutorContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  context: ExecutorContext;
  step: StepTools;
  //publish: TODO 稍后添加实时
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>
) => Promise<ExecutorContext>;
