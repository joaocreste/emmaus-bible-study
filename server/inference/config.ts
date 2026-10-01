/**
 * Inference-layer configuration from the server environment (process env merged
 * with .env / .env.local by server/vitePlugin.ts). Secrets never leave the server.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface CredentialInfo {
  /** where a credential was found; null when none */
  source: 'api-key' | 'auth-token' | 'profile' | null;
  /** explicit key to pass to the SDK (the SDK does not see .env.local on its own) */
  apiKey?: string;
  authToken?: string;
}

export interface InferenceConfig {
  model: string;
  effort: Effort;
  maxTokens: number;
  /** research tool calls per compose request (parallel calls count individually) */
  maxResearchCalls: number;
  /** research tool calls per follow-up answer */
  maxAnswerResearchCalls: number;
  /** wall-clock budget for the research phase before the model is told to compose */
  researchMs: number;
  /** hard limit for one request (model turns stop; a partial page is finalised) */
  totalMs: number;
  /** safety cap on model turns per request */
  maxTurns: number;
  /** server-side refusal fallbacks (`fallbacks: "default"`) */
  fallbacks: boolean;
  credential: CredentialInfo;
  /** project root (absolute) */
  root: string;
  /** .kb-cache directory (pages/, logs/) */
  cacheDir: string;
  /** write debug logs to .kb-cache/logs */
  debugLogs: boolean;
}

export const DEFAULT_MODEL = 'claude-opus-5';
export const NO_CREDENTIAL_REASON = 'Add ANTHROPIC_API_KEY=… to .env.local and restart npm run dev';

const EFFORTS: readonly Effort[] = ['low', 'medium', 'high', 'xhigh', 'max'];

function int(value: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function loadInferenceConfig(env: Record<string, string | undefined>, root: string): InferenceConfig {
  const effortRaw = (env.EMMAUS_EFFORT ?? '').trim().toLowerCase() as Effort;
  return {
    model: env.EMMAUS_MODEL?.trim() || DEFAULT_MODEL,
    effort: EFFORTS.includes(effortRaw) ? effortRaw : 'high',
    maxTokens: int(env.EMMAUS_MAX_TOKENS, 64000, 4096, 128000),
    maxResearchCalls: int(env.EMMAUS_MAX_RESEARCH_CALLS, 12, 1, 60),
    maxAnswerResearchCalls: int(env.EMMAUS_MAX_ANSWER_RESEARCH_CALLS, 6, 0, 30),
    researchMs: int(env.EMMAUS_RESEARCH_SECONDS, 120, 10, 900) * 1000,
    totalMs: int(env.EMMAUS_TIMEOUT_SECONDS, 480, 30, 3600) * 1000,
    maxTurns: int(env.EMMAUS_MAX_TURNS, 40, 4, 120),
    fallbacks: (env.EMMAUS_FALLBACKS ?? '').trim().toLowerCase() !== 'off',
    // EMMAUS_LIVE=off: behave as if no credential exists (the e2e tests must never call the paid API)
    credential: (env.EMMAUS_LIVE ?? '').trim().toLowerCase() === 'off' ? { source: null } : detectCredential(env),
    root,
    cacheDir: join(root, '.kb-cache'),
    debugLogs: (env.EMMAUS_DEBUG_LOGS ?? '').trim().toLowerCase() !== 'off',
  };
}

/**
 * Find a credential without making a (paid) API call: an API key or auth token in the
 * environment, or an `ant auth login` profile on disk (same lookup order as the SDK).
 */
export function detectCredential(env: Record<string, string | undefined>): CredentialInfo {
  const apiKey = env.ANTHROPIC_API_KEY?.trim();
  if (apiKey) return { source: 'api-key', apiKey };
  const authToken = env.ANTHROPIC_AUTH_TOKEN?.trim();
  if (authToken) return { source: 'auth-token', authToken };
  return profileExists(env) ? { source: 'profile' } : { source: null };
}

function configDir(env: Record<string, string | undefined>): string | null {
  if (env.ANTHROPIC_CONFIG_DIR) return env.ANTHROPIC_CONFIG_DIR;
  if (process.platform === 'win32') {
    if (env.APPDATA) return join(env.APPDATA, 'Anthropic');
    if (env.USERPROFILE) return join(env.USERPROFILE, 'AppData', 'Roaming', 'Anthropic');
    return null;
  }
  if (env.XDG_CONFIG_HOME) return join(env.XDG_CONFIG_HOME, 'anthropic');
  if (env.HOME) return join(env.HOME, '.config', 'anthropic');
  return null;
}

function profileExists(env: Record<string, string | undefined>): boolean {
  try {
    const dir = configDir(env);
    if (!dir) return false;
    let profile = env.ANTHROPIC_PROFILE?.trim();
    if (!profile) {
      const active = join(dir, 'active_config');
      profile = existsSync(active) ? readFileSync(active, 'utf8').trim() || 'default' : 'default';
    }
    return existsSync(join(dir, 'credentials', `${profile}.json`)) || existsSync(join(dir, 'configs', `${profile}.json`));
  } catch {
    return false;
  }
}
