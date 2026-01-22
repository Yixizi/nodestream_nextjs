import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useExecutionsParams } from "./use-executions-params";

//获取执行列表
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();
  return useSuspenseQuery(
    trpc.executions.getMany.queryOptions(params)
  );
};

//获取执行
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.executions.getOne.queryOptions({ id })
  );
};
