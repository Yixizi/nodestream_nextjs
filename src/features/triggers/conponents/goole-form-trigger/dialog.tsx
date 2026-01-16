"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  const params = useParams();

  const workflowId = params.workflowId as string;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL 已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            配置Google表单触发器的节点
          </DialogTitle>
          <DialogDescription>
            在 Google 表单的 Apps Script 中使用这个 Webhook
            URL，当表单被提交时，用它来触发这个工作流。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className=" space-y-4">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className=" flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className=" font-mono text-sm"
              />
              <Button
                variant="outline"
                size={"icon"}
                type="button"
                onClick={copyToClipboard}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className=" rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">
              设置说明
            </h4>
            <ol className=" text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>打开你的Google表单</li>
              <li>
                点击右上角的“三个点”菜单 → 选择“Script
                Editor”
              </li>
              <li>复制并粘贴下面提供的脚本</li>
              <li>
                将 WEBHOOK_URL 替换为上方生成的 Webhook URL
              </li>
              <li>
                保存后，点击“Triggers（触发器）” → “Add
                Trigger（添加触发器）”
              </li>
              <li>
                选择： 来源：From form（来自表单） →
                触发条件：On form submit（表单提交时）→
                然后保存
              </li>
            </ol>
          </div>

          <div className=" rounded-lg bg-muted p-4 space-y-3">
            <h4 className=" font-medium text-sm">
              Google表单触发器脚本:
            </h4>
            <Button
              type="button"
              variant={"outline"}
              onClick={async () => {
                const script =
                  generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(
                    script
                  );
                  toast.success(
                    "Google表单触发器脚本已复制到剪贴板"
                  );
                } catch (error) {
                  toast.error("复制失败");
                }
              }}
            >
              <CopyIcon />
              复制 Google 软件脚本
            </Button>
            <p className="text-xs text-muted-foreground">
              这个脚本包含你的 Webhook
              URL，并用于处理表单提交。
            </p>
          </div>
          <div className=" rounded-lg bg-muted p-4 space-y-2">
            <h4 className=" font-medium text-sm">
              可用变量
            </h4>
            <ul>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.respondentEmail}}"}
                </code>
                - 提交者的电子邮件地址
              </li>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {
                    "{{googleForm.responses['Question Name']}}"
                  }
                </code>
                - 明确的回复
              </li>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{json googleForm.responses}}"}
                </code>
                - 全部响应作为 JSON 对象
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
