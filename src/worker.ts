import { onRequest as financeHandler } from '../functions/api/finance/[[route]]';

export interface Env {
  DB: any;
  RECEIPTS_BUCKET?: any;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  VITE_SANITY_PROJECT_ID?: string;
  VITE_SANITY_DATASET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: { waitUntil: (promise: Promise<any>) => void }): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight for /api/* routes
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Route /api/finance/* to finance gateway
    if (url.pathname.startsWith('/api/finance')) {
      const subpath = url.pathname.replace(/^\/api\/finance\/?/, '');
      const parts = subpath ? subpath.split('/') : [];
      const context = {
        request,
        env,
        params: { route: parts },
        waitUntil: (promise: Promise<any>) => ctx.waitUntil(promise),
        next: () => env.ASSETS.fetch(request),
      };
      return financeHandler(context);
    }

    // Fallback to static assets
    return env.ASSETS.fetch(request);
  },
};
