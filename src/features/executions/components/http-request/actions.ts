"use server";

import { httpRequestChannel } from "@/inngest/channel/http-request";
import { inngest } from "@/inngest/client";
import {
  getSubscriptionToken,
  type Realtime,
} from "@inngest/realtime";

export type HttpRequestToken = Realtime.Token<
  typeof httpRequestChannel,
  ["status"]
>;

export async function fetchHttpRequestToken(): Promise<HttpRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });
  return token;
}
