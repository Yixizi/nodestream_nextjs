"use client";

import { NodeType } from "@/generated/prisma/enums";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "手动触发",
    description: "点击运行工作流,快速启动工作流",
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP请求",
    description: "发送HTTP请求,获取响应数据",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className=" w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>是什么触发了这个工作流？</SheetTitle>
          <SheetDescription>触发器是启动工作流的步骤</SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className=" w-full justify-start h-auto py-5 px-4 
                rounded-none cursor-pointer border-l-2 border-transparent
                hover:border-l-primary "
                onClick={() => {}}
              >
                <div className=" flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
