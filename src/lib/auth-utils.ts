import { redirect } from "next/navigation";

import { auth } from "./auth";
import { headers } from "next/headers";

export const requiredAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return session;
};

export const requiredUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/");
  }
  return session;
};
