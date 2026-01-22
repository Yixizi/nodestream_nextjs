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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  const params = useParams();

  const workflowId = params.workflowId as string;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
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
          <DialogTitle>配置Stripe触发器的节点</DialogTitle>
          <DialogDescription>
            请在你的 Stripe 控制台中配置此 Webhook
            URL，以便在发生支付事件时触发该工作流。
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
              <li>打开你的Stripe控制台</li>
              <li>前往 Developers（开发者）→ Webhooks</li>
              <li>点击 “Add endpoint（添加端点）”</li>
              <li>粘贴上方的 Webhook URL</li>
              <li>
                选择需要监听的事件（例如：payment_intent.succeeded）
              </li>
              <li>保存并复制 签名密钥（signing secret）</li>
            </ol>
          </div>

          <div className=" rounded-lg bg-muted p-4 space-y-2">
            <h4 className=" font-medium text-sm">
              可用变量
            </h4>
            <ul>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>
                - 支付金额
              </li>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>
                - 支付货币
              </li>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>
                - 支付者ID
              </li>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>
                - 支付事件的全部数据作为 JSON 对象
              </li>
              <li>
                <code className=" bg-background px-1 py-0.5 rounded">
                  {"{{stripe.envenType}}"}
                </code>
                - 类型 （例如：payment_intent.succeeded）
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
