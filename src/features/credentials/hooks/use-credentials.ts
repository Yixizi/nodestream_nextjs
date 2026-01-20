import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma/enums";

//获取凭证列表
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(params)
  );
};

//创建凭证
export const useCreateCredential = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`凭证 ${data.name} 创建成功`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(`创建凭证失败: ${error.message}`);
      },
    })
  );
};

//删除凭证
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`凭证 ${data.name} 删除成功`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({
            id: data.id,
          })
        );
      },
    })
  );
};

//获取凭证
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id })
  );
};

//更新凭证名称
export const useUpdateCredentialName = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`凭证 ${data.name} 名称更新成功`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({
            id: data.id,
          })
        );
      },
      onError: (error) => {
        toast.error(`更新凭证名称失败: ${error.message}`);
      },
    })
  );
};

//更新凭证
export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`凭证 ${data.name} 更新成功`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({
            id: data.id,
          })
        );
      },
      onError: (error) => {
        toast.error(`更新凭证失败: ${error.message}`);
      },
    })
  );
};

//获取凭证通过类型type
export const useCredentialsByType = (
  type: CredentialType
) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.credentials.getByType.queryOptions({ type })
  );
};
