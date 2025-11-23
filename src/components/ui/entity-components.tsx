import {
  Loader2Icon,
  Package,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { Input } from "./input";
import { AlertDialogTrigger } from "./alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

type EntityHeaderProps = {
  //   children: React.ReactNode;
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);
export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) => {
  return (
    <div className=" flex flex-row items-center justify-between gap-x-4">
      <div className=" flex flex-col">
        <h1 className=" text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className=" text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button size="lg" onClick={onNew} disabled={isCreating || disabled}>
          <PlusIcon size={16} />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button size="lg" asChild>
          <Link href={newButtonHref} prefetch>
            <PlusIcon size={16} />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  search: React.ReactNode;
  pagination: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className=" mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className=" flex flex-col gap-y-4 h-full ">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className=" relative ml-auto">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className=" max-w-[200px] pl-8 bg-background shadow-none border-border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className=" flex items-center justify-between gap-x-2 w-full">
      <div className=" flex-1 text-sm text-muted-foreground">
        {page} / {totalPages || 1} 页
      </div>
      <div className=" flex items-center justify-end space-x-2 py-4 ">
        <Button
          disabled={page <= 1 || disabled}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          variant={"outline"}
          size={"sm"}
        >
          上一页
        </Button>

        <Button
          disabled={disabled || page >= totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          variant={"outline"}
          size={"sm"}
        >
          下一页
        </Button>
      </div>
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className=" flex items-center justify-center h-full flex-1 flex-col gap-y-4 ">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {!!message && <p className=" text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className=" flex items-center justify-center h-full flex-1 flex-col gap-y-4 ">
      <AlertDialogTrigger className="size-6  text-primary" />
      {!!message && <p className=" text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}
export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className=" border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>暂无数据</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew}>创建</Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
