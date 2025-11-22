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
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const loginSchema = z.object({
  email: z.email("请输入正确的邮箱地址"),
  password: z.string().min(1, "密码至少1位"),
});

type loginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: loginFormValues) => {
    console.log(data);
    await signIn.email(
      {
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
            ctx.error.code === "INVALID_EMAIL_OR_PASSWORD"
              ? "邮箱或密码错误"
              : "登录失败",
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
            欢迎回来
          </CardTitle>
          <CardDescription className=" text-center">登录以继续</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=" grid gap-6">
                {/* 第三方登录 */}
                <div className=" flex flex-col gap-4 ">
                  <Button
                    variant={"outline"}
                    className=" w-full font-bold"
                    type="button"
                    disabled={isPending}
                  >
                    <Image
                      src="/logos/github.svg"
                      alt="GitHub"
                      width={20}
                      height={20}
                    />
                    GitHub登录
                  </Button>
                  <Button
                    variant={"outline"}
                    className=" w-full font-bold"
                    type="button"
                    disabled={isPending}
                  >
                    <Image
                      src="/logos/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                    />
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
                  <Button
                    type="submit"
                    className=" w-full"
                    disabled={isPending}
                  >
                    {isPending ? "登录中..." : "登录"}
                  </Button>
                </div>
                <div className=" text-center text-sm">
                  没有账号？
                  <Link
                    href="/signup"
                    className=" underline underline-offset-4"
                  >
                    注册
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
