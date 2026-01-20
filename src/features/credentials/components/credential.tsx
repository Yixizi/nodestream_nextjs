"use client";

import { useRouter } from "next/navigation";
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CredentialType } from "@/generated/prisma/enums";

const formSchema = z.object({
  name: z.string().min(1, "名称是必填项"),
  type: z.enum(CredentialType, "凭证类型是必填项"),
  value: z.string().min(1, "值是必填项"),
});

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOption = [
  {
    label: "Deepseek",
    value: CredentialType.DEEPSEEK,
    logo: "/logos/deepseek.svg",
  },
  {
    label: "Gemini",
    value: CredentialType.GEMINI,
    logo: "/logos/gemini.svg",
  },
];

export const CredentialForm = ({
  initialData,
}: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.DEEPSEEK,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      updateCredential.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      createCredential.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  return (
    <>
      {modal}
      <Card className=" shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "编辑凭证" : "新建凭证"}
          </CardTitle>
          <CardDescription>
            {isEdit ? "编辑凭证信息" : "创建一个新的凭证"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 "
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>凭证名称</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="我的API KEY"
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>凭证类型</FormLabel>
                    <Select
                      onOpenChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue className=" w-full" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {credentialTypeOption.map(
                          (item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                            >
                              <div className=" flex items-center gap-2">
                                <Image
                                  src={item.logo}
                                  alt={item.label}
                                  width={16}
                                  height={16}
                                />
                                {item.label}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API KEY</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sk-xxxxxx"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <div className=" flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    createCredential.isPending ||
                    updateCredential.isPending
                  }
                >
                  {isEdit ? "保存" : "创建"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push("/credentials")
                  }
                  asChild
                >
                  <Link href={"/credentials"} prefetch>
                    取消
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export const CredentialView = ({
  credentialId,
}: {
  credentialId: string;
}) => {
  const { data: credential } =
    useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
