"use server";

import { deepseekChannel } from "@/inngest/channel/deepseek";

import { inngest } from "@/inngest/client";
import {
  getSubscriptionToken,
  type Realtime,
} from "@inngest/realtime";

export type DeepseekToken = Realtime.Token<
  typeof deepseekChannel,
  ["status"]
>;

export async function fetchDeepseekToken(): Promise<DeepseekToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: deepseekChannel(),
    topics: ["status"],
  });
  return token;
}
