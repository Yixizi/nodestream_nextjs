"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

const registerSchema = z
  .object({
    email: z.email("请输入正确的邮箱地址"),
    password: z.string().min(1, "密码至少1位"),
    confirmPassword: z.string().min(1, "确认密码至少1位"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密码和确认密码不一致",
    path: ["confirmPassword"],
  });

type registerFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<registerFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });
  const onSubmit = async (data: registerFormValues) => {
    console.log(data);
    await signUp.email(
      {
        name: data.email,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          console.log(ctx.error);
          toast.error(
            ctx.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
              ? "邮箱已存在"
              : "注册失败",
          );
        },
      },
    );
  };
  const isPending = form.formState.isSubmitting;

  return (
    <div className=" flex flex-col gap-4 ">
      <Card>
        <CardHeader>
          <CardTitle className=" text-2xl font-bold text-center">
            立即开始
          </CardTitle>
          <CardDescription className=" text-center">
            创建一个新账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=" grid gap-6">
                {/* 第三方登录 */}
                <div className=" flex flex-col gap-4">
                  <Button
                    variant={"outline"}
                    className=" w-full"
                    type="button"
                    disabled={isPending}
                  >
                    GitHub登录
                  </Button>
                  <Button
                    variant={"outline"}
                    className=" w-full"
                    type="button"
                    disabled={isPending}
                  >
                    Google登录
                  </Button>
                </div>
                {/* 表单登录 */}
                <div className=" grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="user@example.com"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="********"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>确认密码</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="********"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className=" w-full"
                    disabled={isPending}
                  >
                    {isPending ? "注册中..." : "注册"}
                  </Button>
                </div>
                <div className=" text-center text-sm">
                  已有账号？
                  <Link href="/login" className=" underline underline-offset-4">
                    登录
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
