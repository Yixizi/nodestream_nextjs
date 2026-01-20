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
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  systemPrompt: z.string().optional(),
  userPrompt: z
    .string()
    .min(1, { message: "请输入用户提示词" }),
  variableName: z
    .string()
    .min(1, { message: "请输入变量名" })
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, {
      message:
        "变量名必须以字母或下划线（或 $）开头，后续只能包含字母、数字、下划线或 $。",
    }),
  credentialId: z
    .string()
    .min(1, { message: "请选择凭证" }),
  // .refine() to do
});

export type GeminiFormValues = z.infer<typeof formSchema>;
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const {
    data: credentials,
    isLoading: isLoadingCredentials,
    error: errorCredentials,
  } = useCredentialsByType(CredentialType.GEMINI);
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId: defaultValues?.credentialId || "",
      variableName: defaultValues?.variableName || "",
      systemPrompt: defaultValues?.systemPrompt || "",
      userPrompt: defaultValues?.userPrompt || "",
    },
  });
  const currentCredential = useMemo(() => {
    return credentials?.find((credential) => {
      return credential.id === defaultValues?.credentialId;
    });
  }, [credentials, defaultValues?.credentialId]);

  const watchVariableName =
    useWatch({
      control: form.control,
      name: "variableName",
      defaultValue: "myApiCall",
    }) || "myApiCall";
  const handleSubmit = (data: GeminiFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName || "",
        systemPrompt: defaultValues?.systemPrompt || "",
        userPrompt: defaultValues?.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>配置 Gemini</DialogTitle>
          <DialogDescription>
            配置Gemini以及提示词的节点
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
                      placeholder="myGemini"
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
                    {`{{ ${watchVariableName}.text }}`}
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini 凭证</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      isLoadingCredentials ||
                      !credentials?.length
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          className=" w-full"
                          placeholder={
                            currentCredential?.name ||
                            "请选择凭证"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem
                          key={credential.id}
                          value={credential.id}
                        >
                          <div className=" flex items-center gap-2">
                            <Image
                              src={"/logos/gemini.svg"}
                              alt="Gemini"
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>系统提示词（可选）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="你是一个助手，请根据用户的问题给出回答。"
                      className=" min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.systemPrompt && (
                    <FormMessage>
                      {
                        form.formState.errors.systemPrompt
                          .message
                      }
                    </FormMessage>
                  )}
                  <FormDescription>
                    设置系统提示词，用于引导Gemini的回答。使用{" "}
                    {"{{变量名}}"}{" "}
                    插入简单值（字符串、数字等）， 使用{" "}
                    {"{{json 变量名}}"}{" "}
                    插入整个对象（会自动序列化为 JSON
                    字符串）。 例如：
                    {"{{userId}}"} 会被替换为实际值，
                    {"{{json userData}}"} 会被替换为完整的
                    JSON 对象。
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户提示词</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="对这段文本进行总结：{{json httpResponse.data}}"
                      className=" min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.userPrompt && (
                    <FormMessage>
                      {
                        form.formState.errors.userPrompt
                          .message
                      }
                    </FormMessage>
                  )}
                  <FormDescription>
                    设置用户提示词，用于引导Gemini的回答。使用{" "}
                    {"{{变量名}}"}{" "}
                    插入简单值（字符串、数字等）， 使用{" "}
                    {"{{json 变量名}}"}{" "}
                    插入整个对象（会自动序列化为 JSON
                    字符串）。
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
