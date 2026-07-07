export const onRequest: PagesFunction = async (context) => {
  const acceptHeader = context.request.headers.get("accept") || "";
  const url = new URL(context.request.url);

  // If the agent requests markdown for the root page
  if (acceptHeader.includes("text/markdown") && (url.pathname === "/" || url.pathname === "/index.html")) {
    const projectId = "vq0v7yv4";
    const dataset = "production";
    
    // Query both homepage content and committees list to provide a comprehensive response
    const query = encodeURIComponent(`{
      "home": *[_type == "homePage"][0]{
        heroTitle,
        heroSubtitle,
        aboutContent,
        stats[] { value, label, subtext }
      },
      "committees": *[_type == "committee" && !(_id in drafts)] {
        name,
        tagline,
        status,
        id
      }
    }`);
    
    const sanityUrl = `https://${projectId}.apicdn.sanity.io/v2024-03-16/data/query/${dataset}?query=${query}`;
    
    let markdown = `# Purdue University IEEE Student Branch\n\n`;
    
    try {
      const response = await fetch(sanityUrl);
      if (response.ok) {
        const json = await response.json();
        const data = json.result;
        
        if (data.home) {
          markdown += `## ${data.home.heroTitle || 'Purdue IEEE'}\n`;
          markdown += `> ${data.home.heroSubtitle || ''}\n\n`;
          markdown += `### About Us\n${data.home.aboutContent || ''}\n\n`;
          
          if (data.home.stats && data.home.stats.length > 0) {
            markdown += `### Key Statistics\n`;
            data.home.stats.forEach((s: any) => {
              markdown += `- **${s.value}**: ${s.label} (${s.subtext || ''})\n`;
            });
            markdown += `\n`;
          }
        }
        
        if (data.committees && data.committees.length > 0) {
          markdown += `### Technical Committees\n`;
          data.committees.forEach((c: any) => {
            const cId = typeof c.id === 'string' ? c.id : c.id?.current;
            markdown += `- **${c.name}** [${c.status || 'ACTIVE'}]: ${c.tagline || ''} (Details: ${url.origin}/committee/${cId})\n`;
          });
          markdown += `\n`;
        }
      }
    } catch (e) {
      markdown += `Welcome to the official website of the Purdue University IEEE Student Branch.\n\n`;
    }
    
    // Add links to other resources
    markdown += `### Navigation & Resources\n`;
    markdown += `- About Us: ${url.origin}/about\n`;
    markdown += `- Technical Committees: ${url.origin}/committees\n`;
    markdown += `- Officers & Leadership: ${url.origin}/officers\n`;
    markdown += `- Event Calendar: ${url.origin}/calendar\n`;
    markdown += `- Join Purdue IEEE: ${url.origin}/join\n`;
    markdown += `- Corporate Partners: ${url.origin}/partners\n`;
    markdown += `- Constitution: ${url.origin}/constitution\n`;

    const tokenCount = Math.ceil(markdown.length / 4); // rough approximation of tokens

    return new Response(markdown.trim(), {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(tokenCount),
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  // Otherwise, proceed to render the static HTML/SPA bundle
  return context.next();
};
