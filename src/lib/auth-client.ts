import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";


export const { signIn, signUp, signOut, useSession } = createAuthClient();
export const authClient = createAuthClient({
  plugins: [polarClient()],
});
