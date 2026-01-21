"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "请输入变量名" })
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, {
      message:
        "变量名必须以字母或下划线（或 $）开头，后续只能包含字母、数字、下划线或 $。",
    }),

  content: z.string().min(1, { message: "请输入内容" }),
  webhookUrl: z
    .string()
    .min(1, { message: "请输入Webhook URL" }),
});

export type SlackFormValues = z.infer<typeof formSchema>;
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<SlackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || "",
      content: defaultValues?.content || "",
      webhookUrl: defaultValues?.webhookUrl || "",
    },
  });

  const watchVariableName =
    useWatch({
      control: form.control,
      name: "variableName",
      defaultValue: "mySlack",
    }) || "mySlack";
  const handleSubmit = (data: SlackFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName || "",
        content: defaultValues?.content || "",
        webhookUrl: defaultValues?.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>配置 Slack</DialogTitle>
          <DialogDescription>
            配置Slack以及消息的节点
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className=" space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>变量名</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="mySlack"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.variableName && (
                    <FormMessage>
                      {
                        form.formState.errors.variableName
                          .message
                      }
                    </FormMessage>
                  )}
                  <FormDescription>
                    使用变量名来引用请求响应中的数据。例如：
                    {`{{ ${watchVariableName}.content }}`}
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    在Slack的频道设置（Workspace Setting） →
                    Workflows → 创建Webhook → 复制Webhook
                    URL
                  </FormDescription>
                  <FormDescription>
                    请确保"key"是"content"
                  </FormDescription>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>信息内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="总结：{{aiResponse}}"
                      className=" min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.content && (
                    <FormMessage>
                      {
                        form.formState.errors.content
                          .message
                      }
                    </FormMessage>
                  )}
                  <FormDescription>
                    发送消息，使用{"{{变量名}}"}{" "}
                    插入简单值（字符串、数字等） 或者 ,
                    {"{{json 变量名}}"}{" "}
                    插入整个对象（会自动序列化为 JSON
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>

            <DialogFooter className="mt-4">
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
