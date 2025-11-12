import { requiredAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  await requiredAuth();

  return <div>Workflow Id: {workflowId}</div>;
};

export default Page;
