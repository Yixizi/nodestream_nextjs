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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  endpoint: z.url({ message: "请输入一个有效的URL" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"], {
    message: "请选择一个有效的HTTP方法",
  }),
  body: z.string().optional(),
  variableName: z
    .string()
    .min(1, { message: "请输入变量名" })
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, {
      message:
        "变量名必须以字母或下划线（或 $）开头，后续只能包含字母、数字、下划线或 $。",
    }),
  // .refine() to do
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || "",
      endpoint: defaultValues?.endpoint || "",
      method: defaultValues?.method || "GET",
      body: defaultValues?.body || "",
    },
  });

  const watchMethod = useWatch({
    control: form.control,
    name: "method",
    defaultValue: "GET", // 建议提供默认值
  });
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  const watchVariableName =
    useWatch({
      control: form.control,
      name: "variableName",
      defaultValue: "myApiCall",
    }) || "myApiCall";
  const handleSubmit = (data: HttpRequestFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP请求</DialogTitle>
          <DialogDescription>配置HTTP请求的节点</DialogDescription>
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
                    <Input placeholder="myApiCall" {...field} />
                  </FormControl>
                  {form.formState.errors.endpoint && (
                    <FormMessage>
                      {form.formState.errors.endpoint.message}
                    </FormMessage>
                  )}
                  <FormDescription>
                    使用变量名来引用请求响应中的数据。例如：
                    {`{{ ${watchVariableName}.httpResponse.data }}`}
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>请求方法</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择一个方法" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      {/* <SelectItem value="GET">获取</SelectItem>
                      <SelectItem value="POST">发布</SelectItem>
                      <SelectItem value="PUT">更新</SelectItem>
                      <SelectItem value="PATCH">修改</SelectItem>
                      <SelectItem value="DELETE">删除</SelectItem> */}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.method && (
                    <FormMessage>
                      {form.formState.errors.method.message}
                    </FormMessage>
                  )}
                  <FormDescription>该请求将使用此方法</FormDescription>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>请求端口</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.endpoint && (
                    <FormMessage>
                      {form.formState.errors.endpoint.message}
                    </FormMessage>
                  )}
                  <FormDescription>
                    输入完整的 URL 地址。如需动态替换值，使用 {"{{变量名}}"}{" "}
                    插入简单值（如字符串、数字）， 或使用 {"{{json 变量名}}"}{" "}
                    插入整个对象（会自动转换为 JSON 字符串）。
                    例如：https://api.example.com/users/{"{{userId}}"}
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>
            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>请求体</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`{ \n  "userId": "{{httpResponse.data.id}}", \n  "name": "{{httpResponse.data.name}}", \n  "items": "{{httpResponse.data.items}}"\n }`}
                        className=" min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.body && (
                      <FormMessage>
                        {form.formState.errors.body.message}
                      </FormMessage>
                    )}
                    <FormDescription>
                      输入 JSON 格式的请求体。使用 {"{{变量名}}"}{" "}
                      插入简单值（字符串、数字等）， 使用 {"{{json 变量名}}"}{" "}
                      插入整个对象（会自动序列化为 JSON 字符串）。 例如：
                      {"{{userId}}"} 会被替换为实际值，{"{{json userData}}"}{" "}
                      会被替换为完整的 JSON 对象。
                    </FormDescription>
                  </FormItem>
                )}
              ></FormField>
            )}
            <DialogFooter className="mt-4">
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
