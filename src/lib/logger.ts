/**
 * Structured logger with levels, context, and env-aware output.
 *
 * Features:
 *  - Levels: debug, info, warn, error
 *  - Structured fields (object context)
 *  - Env-aware: debug only in dev, filtered by LOG_LEVEL
 *  - JSON output in production, pretty in dev
 *  - No PII logging — caller is responsible
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("Business viewed", { id: "b1", name: "Sankalp" });
 *   logger.error("DB query failed", { error: err.message });
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const CONSOLE_METHOD: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

function getMinLevel(): LogLevel {
  // Lazy import to avoid circular dependency at module load
  // We read LOG_LEVEL from process.env directly (validated by env.ts at startup)
  const configured = process.env.LOG_LEVEL as LogLevel | undefined;
  return configured ?? (process.env.NODE_ENV === "production" ? "info" : "debug");
}

function formatPretty(level: LogLevel, msg: string, ctx: LogContext): string {
  const ts = new Date().toISOString();
  const ctxStr = Object.keys(ctx).length
    ? " " + JSON.stringify(ctx)
    : "";
  return `[${ts}] ${level.toUpperCase().padEnd(5)} ${msg}${ctxStr}`;
}

function formatJson(level: LogLevel, msg: string, ctx: LogContext): string {
  return JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg,
    ...ctx,
  });
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[getMinLevel()];
}

function log(level: LogLevel, msg: string, ctx: LogContext = {}): void {
  if (!shouldLog(level)) return;

  const isProd = process.env.NODE_ENV === "production";
  const output = isProd
    ? formatJson(level, msg, ctx)
    : formatPretty(level, msg, ctx);

  CONSOLE_METHOD[level](output);
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log("debug", msg, ctx ?? {}),
  info: (msg: string, ctx?: LogContext) => log("info", msg, ctx ?? {}),
  warn: (msg: string, ctx?: LogContext) => log("warn", msg, ctx ?? {}),
  error: (msg: string, ctx?: LogContext) => log("error", msg, ctx ?? {}),
};

/**
 * Create a child logger with a persistent context field.
 * Useful for request-scoped or module-scoped logging.
 *
 *   const log = logger.child({ module: "api/health" });
 *   log.info("Health check passed");
 */
export function createLogger(defaultCtx: LogContext) {
  return {
    debug: (msg: string, ctx?: LogContext) =>
      log("debug", msg, { ...defaultCtx, ...ctx }),
    info: (msg: string, ctx?: LogContext) =>
      log("info", msg, { ...defaultCtx, ...ctx }),
    warn: (msg: string, ctx?: LogContext) =>
      log("warn", msg, { ...defaultCtx, ...ctx }),
    error: (msg: string, ctx?: LogContext) =>
      log("error", msg, { ...defaultCtx, ...ctx }),
  };
}
