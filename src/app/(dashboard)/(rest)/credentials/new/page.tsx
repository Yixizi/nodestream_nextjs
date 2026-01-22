import { CredentialForm } from "@/features/credentials/components/credential";
import { requiredAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
  await requiredAuth();
  return (
    <div className=" p-4 md:px-10 md:py-6 h-full">
      <div className=" mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full ">
        {/* <HydrateClient>
          <ErrorBoundary fallback={<p>error</p>}>
            <Suspense fallback={<p>loading</p>}> */}
        <CredentialForm />
        {/* </Suspense>
          </ErrorBoundary>
        </HydrateClient> */}
      </div>
    </div>
  );
};

export default Page;
