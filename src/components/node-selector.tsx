"use client";

import { GlobeIcon, MousePointerIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { createId } from "@paralleldrive/cuid2";
import { useCallback } from "react";
import { toast } from "sonner";
import { NodeType } from "@/generated/prisma/enums";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon:
    | React.ComponentType<{ className?: string }>
    | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "手动触发",
    description: "点击运行工作流,快速启动工作流",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google表单触发",
    description: "当Google表单被填写提交后触发",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe触发",
    description: "当Stripe事件被捕获后触发",
    icon: "/logos/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP请求",
    description: "发送HTTP请求,获取响应数据",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "使用Gemini API进行AI处理",
    icon: "/logos/gemini.svg",
  },
  {
    type: NodeType.DEEPSEEK,
    label: "Deepseek",
    description: "使用Deepseek API进行AI处理",
    icon: "/logos/deepseek.svg",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "发送消息给Discord",
    icon: "/logos/discord.svg",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "发送消息给Slack",
    icon: "/logos/slack.svg",
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
  const { setNodes, getNodes, screenToFlowPosition } =
    useReactFlow();
  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("手动触发器只能有一个");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const position = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          type: selection.type,
          position,
          data: {},
        };
        if (hasInitialTrigger) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [onOpenChange, setNodes, getNodes, screenToFlowPosition]
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className=" w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>是什么触发了这个工作流？</SheetTitle>
          <SheetDescription>
            触发器是启动工作流的步骤
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className=" w-full justify-start gap-4 flex h-auto py-5 px-4 
                rounded-none cursor-pointer border-l-2 border-transparent
                hover:border-l-primary "
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className=" flex items-center gap-6  overflow-hidden">
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
                <div className=" flex flex-col gap-1 items-start text-left">
                  <span className=" text-sm font-medium">
                    {nodeType.label}
                  </span>
                  <span className=" text-xs text-muted-foreground">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className=" w-full justify-start flex gap-4 h-auto py-5 px-4 
                rounded-none cursor-pointer border-l-2 border-transparent
                hover:border-l-primary "
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className=" flex items-center gap-6 overflow-hidden">
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
                <div className=" flex flex-col gap-1 items-start text-left">
                  <span className=" text-sm font-medium">
                    {nodeType.label}
                  </span>
                  <span className=" text-xs text-muted-foreground">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
