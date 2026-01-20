"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/ui/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";

import Image from "next/image";
import {
  Credential,
  CredentialType,
} from "@/generated/prisma/browser";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="搜索凭证"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => (
        <CredentialItem data={credential} />
      )}
      emptyView={<CredentialsEmpty />}
    ></EntityList>
  );
};

export const CredentialsHeader = ({
  disabled,
}: {
  disabled?: boolean;
}) => {
  return (
    <EntityHeader
      title="凭证"
      description="创建并管理你的凭证"
      disabled={disabled}
      newButtonLabel="新建凭证"
      newButtonHref="/credentials/new"
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      page={credentials.data.page}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) =>
        setParams({ ...params, page })
      }
      disabled={credentials.isPending}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="正在加载凭证..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="加载凭证失败，请重试" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();
  const handleCreate = () => {
    router.push(`/credentials/new`);
  };

  return (
    <EmptyView
      message="暂无凭证被找到，请创建一个"
      onNew={handleCreate}
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.DEEPSEEK]: "/logos/deepseek.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialItem = ({
  data,
}: {
  data: Credential;
}) => {
  const removeCredential = useRemoveCredential();
  const handleRemove = () => {
    removeCredential.mutate(
      { id: data.id },
      {
        onSuccess: () => {},
      }
    );
  };

  const logo = credentialLogos[data.type];
  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          上次更新{" "}
          {formatDistanceToNow(data.updatedAt, {
            addSuffix: true,
          })}{" "}
          &bull; 创建时间
          {formatDistanceToNow(data.createdAt, {
            addSuffix: true,
          })}{" "}
        </>
      }
      image={
        <div className=" size-8  flex items-center justify-center">
          <Image
            src={logo}
            alt={data.type}
            width={20}
            height={20}
          />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
