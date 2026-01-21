"use server";

import { discordChannel } from "@/inngest/channel/discord";

import { inngest } from "@/inngest/client";
import {
  getSubscriptionToken,
  type Realtime,
} from "@inngest/realtime";

export type DiscordToken = Realtime.Token<
  typeof discordChannel,
  ["status"]
>;

export async function fetchDiscordToken(): Promise<DiscordToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });
  return token;
}
