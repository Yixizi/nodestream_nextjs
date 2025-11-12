import { requiredAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requiredAuth();
  return <div>Workflows</div>;
};

export default Page;
