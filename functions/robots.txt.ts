export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const origin = url.origin;

  const robotsText = `User-agent: *
Disallow:
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(robotsText, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
