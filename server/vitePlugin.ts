/**
 * Mounts the local inference API (/api/inference/*) on Vite's dev and preview servers.
 *
 * The server code (server/app.ts and everything it imports, including src/ modules)
 * is loaded through Vite's SSR module graph, so it can reuse the app's domain code,
 * providers and curated library unchanged — and it reloads when those files change.
 *
 * Secrets: ANTHROPIC_API_KEY is read from the environment or .env.local on the server
 * side only (it has no VITE_ prefix, so Vite never exposes it to the browser).
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadEnv, type Plugin, type ViteDevServer } from 'vite';

export interface InferenceServerEnv {
  /** process env merged with .env / .env.local (server-side only) */
  env: Record<string, string>;
  /** project root (absolute) */
  root: string;
}

type Handler = (req: IncomingMessage, res: ServerResponse, ctx: InferenceServerEnv) => Promise<void>;

export function emmausInference(): Plugin {
  let root = process.cwd();
  let env: Record<string, string> = {};
  return {
    name: 'emmaus-inference',
    configResolved(config) {
      root = config.root;
      env = { ...loadEnv(config.mode, config.root, ''), ...stringEnv(process.env) };
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/inference/')) return next();
        try {
          const mod = (await server.ssrLoadModule('/server/app.ts')) as { handleInferenceRequest: Handler };
          await mod.handleInferenceRequest(req, res, { env, root });
        } catch (err) {
          server.config.logger.error(`[emmaus-inference] ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
          }
          res.end(JSON.stringify({ error: 'internal' }));
        }
      });
    },
  };
}

function stringEnv(e: NodeJS.ProcessEnv): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(e)) if (typeof v === 'string') out[k] = v;
  return out;
}
