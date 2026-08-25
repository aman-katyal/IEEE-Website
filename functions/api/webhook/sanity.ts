import type { PagesFunction } from "@cloudflare/workers-types";

import { handleSanityWebhook } from "../../../src/server/webhook/sanityPurge";

export const onRequest: PagesFunction<any> = async (context): Promise<any> => {
  return handleSanityWebhook(context.request, context.env);
};
