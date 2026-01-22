"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/ui/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { formatDistanceToNow } from "date-fns";
import {
  Execution,
  ExecutionStatus,
} from "@/generated/prisma/browser";
import {
  CheckCircle2Icon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => (
        <ExecutionItem data={execution} />
      )}
      emptyView={<ExecutionsEmpty />}
    ></EntityList>
  );
};

export const ExecutionsHeader = ({
  disabled,
}: {
  disabled?: boolean;
}) => {
  return (
    <EntityHeader
      title="执行记录"
      description="浏览你的执行记录"
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      page={executions.data.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) =>
        setParams({ ...params, page })
      }
      disabled={executions.isPending}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="正在加载执行记录..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="加载执行记录失败，请重试" />;
};

export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="暂无执行记录被找到，开始执行你的第一个工作流吧" />
  );
};

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

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      name: string;
      id: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000
      )
    : null;

  const subtitle = (
    <>
      {data.workflow.name} {" • "} 开始于{" "}
      {formatDistanceToNow(data.startedAt, {
        addSuffix: true,
      })}
      {duration !== null && ` •  持续 ${duration} 秒`}
    </>
  );
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className=" size-8  flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
