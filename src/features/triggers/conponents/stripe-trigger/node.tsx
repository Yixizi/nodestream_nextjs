import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

import { fetchStripeTriggerToken } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channel/stripe-trigger";

export const StripeTriggerNode = memo(
  (props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: STRIPE_TRIGGER_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchStripeTriggerToken,
    });
    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    return (
      <>
        <StripeTriggerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
          {...props}
          icon={"/logos/stripe.svg"}
          name="Stripe触发"
          description="当Stripe事件被捕获后触发"
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

StripeTriggerNode.displayName = "StripeTriggerNode";
