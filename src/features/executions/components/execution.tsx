"use client";
import { ExecutionStatus } from "@/generated/prisma/enums";
import {
  CheckCircle2Icon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { useSuspenseExecution } from "../hooks/use-executions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return (
        <CheckCircle2Icon className="size-5 text-green-600" />
      );
    case ExecutionStatus.FAILED:
      return (
        <XCircleIcon className="size-5 text-red-600" />
      );
    default:
      return (
        <Loader2Icon className="size-5 text-blue-600 animate-spin" />
      );
  }
};

const formatStatus = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return "成功";
    case ExecutionStatus.FAILED:
      return "失败";
    case ExecutionStatus.RUNNING:
      return "运行中";
    default:
      return "未知";
  }
};

export const ExecutionView = ({
  executionId,
}: {
  executionId: string;
}) => {
  const [showStackTrace, setShowStackTrace] =
    useState(false);
  const { data: execution } =
    useSuspenseExecution(executionId);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000
      )
    : null;

  return (
    <Card className="shadow-none max-w-full">
      <CardHeader>
        <div className=" flex items-center  gap-3">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>
              {formatStatus(execution.status)}
            </CardTitle>
            <CardDescription>
              {execution.workflow.name}的执行记录
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className=" space-y-4">
        <div className=" grid grid-cols-2 gap-4">
          <div className="">
            <p className=" text-sm font-medium text-muted-foreground">
              工作流
            </p>
            <Link
              href={`/workflows/${execution.workflowId}`}
              prefetch
              className=" text-sm hover:underline text-primary"
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="text-sm font-medium ">状态</p>
            <p className=" text-sm">
              {formatStatus(execution.status)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium ">开始于</p>
            <p className=" text-sm">
              {formatDistanceToNow(execution.startedAt, {
                addSuffix: true,
              })}
            </p>
          </div>

          {execution.completedAt && (
            <div>
              <p className="text-sm font-medium ">完成于</p>
              <p className=" text-sm">
                {formatDistanceToNow(
                  execution.completedAt,
                  {
                    addSuffix: true,
                  }
                )}
              </p>
            </div>
          )}

          {duration !== null && (
            <div>
              <p className="text-sm font-medium ">
                执行时间
              </p>
              <p className=" text-sm">{duration}s</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium ">
              Inngest 事件 ID
            </p>
            <p className=" text-sm">
              {execution.inngestEventId}
            </p>
          </div>
        </div>

        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3 ">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2 w-30">
                错误
              </p>
              <p className=" text-sm text-red-800 font-mono   min-w-0 whitespace-pre-wrap break-all">
                {execution.error}
              </p>
            </div>
            {execution.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace
                      ? "隐藏错误栈"
                      : "显示错误栈"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre
                    className={cn(
                      " text-sm text-red-800 font-mono overflow-auto mt-2 p-2 bg-red-100 rounded min-w-0 break-all whitespace-pre-wrap"
                    )}
                  >
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output && (
          <div className="mt-6 p-4 bg-muted rounded-md  ">
            <p className=" text-sm font-medium mb-2 ">
              输出
            </p>
            <pre className=" text-xs font-mono overflow-auto ">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
