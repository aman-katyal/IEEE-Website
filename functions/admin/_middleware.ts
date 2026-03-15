export const onRequest: PagesFunction = async ({ request, next, env }) => {
  const url = new URL(request.url);

  // Only protect the /admin route
  if (url.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }

    const [scheme, encoded] = authHeader.split(' ');
    if (scheme !== 'Basic') {
      return new Response('Bad Request', { status: 400 });
    }

    const decoded = atob(encoded);
    const [username, password] = decoded.split(':');

    // Use environment variables from Cloudflare Dashboard (Settings > Functions)
    // Fallback to hardcoded values for testing (NOT RECOMMENDED FOR PRODUCTION)
    const ADMIN_USER = (env.ADMIN_USER as string) || 'admin';
    const ADMIN_PASS = (env.ADMIN_PASS as string) || 'purdueieee2026';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return await next();
    }

    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  return await next();
};
