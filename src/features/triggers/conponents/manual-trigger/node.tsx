import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channel/manual-trigger";
import { fetchManualTriggerToken } from "./actions";

export const ManualTriggerNode = memo(
  (props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: MANUAL_TRIGGER_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchManualTriggerToken,
    });

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    return (
      <>
        <ManualTriggerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
          {...props}
          icon={MousePointerIcon}
          name="当点击'运行'按钮时触发"
          description="点击运行工作流,快速启动工作流"
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

ManualTriggerNode.displayName = "ManualTriggerNode";
