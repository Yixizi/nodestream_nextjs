"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>手动触发器</DialogTitle>
          <DialogDescription>配置手动触发器的节点</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className=" text-sm text-muted-foreground">
            通常作用于执行工作流，无需进行配置
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
