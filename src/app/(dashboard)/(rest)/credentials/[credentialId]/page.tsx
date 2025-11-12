import { requiredAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { credentialId } = await params;
  await requiredAuth();
  return <div>Credential Id: {credentialId}</div>;
};

export default Page;
