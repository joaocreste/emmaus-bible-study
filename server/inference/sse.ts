/**
 * Server-Sent Events writer for the inference endpoints: unbuffered headers, one
 * `event:`/`data:` block per InferenceEvent (protocol `encodeEvent`), a heartbeat
 * comment every 15 s so proxies and the browser keep the connection open while the
 * model thinks, and a `closed` flag once the client has gone.
 */
import type { ServerResponse } from 'node:http';
import { encodeEvent, type InferenceEvent } from '../../src/inference/protocol';

export const HEARTBEAT_MS = 15_000;

export interface SseWriter {
  send(event: InferenceEvent): void;
  /** end the response (idempotent) */
  close(): void;
  /** the response ended or the client disconnected */
  readonly closed: boolean;
}

export const SSE_HEADERS: Readonly<Record<string, string>> = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
  // nginx and similar proxies: do not buffer the stream
  'x-accel-buffering': 'no',
};

export function openSse(res: ServerResponse, options: { heartbeatMs?: number } = {}): SseWriter {
  res.statusCode = 200;
  for (const [k, v] of Object.entries(SSE_HEADERS)) res.setHeader(k, v);
  res.socket?.setNoDelay(true);
  res.flushHeaders();
  let closed = false;
  const write = (chunk: string) => {
    if (closed || res.writableEnded || res.destroyed) return;
    try {
      res.write(chunk);
    } catch {
      closed = true;
    }
  };
  // An initial comment makes the browser treat the stream as open right away.
  write(': stream open\n\n');
  const heartbeat = setInterval(() => write(`: heartbeat ${Date.now()}\n\n`), options.heartbeatMs ?? HEARTBEAT_MS);
  heartbeat.unref?.();
  const stop = () => {
    closed = true;
    clearInterval(heartbeat);
  };
  res.on('close', stop);
  return {
    send(event) {
      write(encodeEvent(event));
    },
    close() {
      if (!closed && !res.writableEnded) {
        clearInterval(heartbeat);
        try {
          res.end();
        } catch {
          /* already gone */
        }
      }
      stop();
    },
    get closed() {
      return closed || res.writableEnded || res.destroyed;
    },
  };
}
