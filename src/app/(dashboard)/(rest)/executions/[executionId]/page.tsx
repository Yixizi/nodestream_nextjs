import { requiredAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { executionId } = await params;
  await requiredAuth();

  return <div>Execution Id: {executionId}</div>;
};

export default Page;
