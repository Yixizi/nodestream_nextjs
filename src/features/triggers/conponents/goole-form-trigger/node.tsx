import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channel/google-form-trigger";
import { fetchGoogleFormTriggerToken } from "./actions";

export const GoogleTriggerNode = memo(
  (props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchGoogleFormTriggerToken,
    });
    const handleOpenSettings = () => {
      setDialogOpen(true);
    };
    return (
      <>
        <GoogleFormTriggerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
          {...props}
          icon={"/logos/googleform.svg"}
          name="Google表单"
          description="当表单被提交后触发"
          status={nodeStatus}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

GoogleTriggerNode.displayName = "GoogleTriggerNode";
