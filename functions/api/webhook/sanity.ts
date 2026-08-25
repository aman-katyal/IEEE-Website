
import { handleSanityWebhook } from "../../../src/server/webhook/sanityPurge";

export const onRequest: PagesFunction<any> = async (context) => {
  return handleSanityWebhook(context.request, context.env);
};
