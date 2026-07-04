/**
 * Environment configuration with validation.
 *
 * Validates required environment variables at startup so the app fails fast
 * with a clear message instead of silently misbehaving.
 *
 * Usage:
 *   import { env } from "@/lib/env";
 *   env.DATABASE_URL; // string, validated
 */

type EnvSchema<T> = {
  key: string;
  default?: string;
  required?: boolean;
  validate?: (v: string) => T;
};

const BOOLEAN = (v: string): boolean => v === "true" || v === "1" || v === "yes";

const schemas = {
  NODE_ENV: {
    key: "NODE_ENV",
    default: "development",
    validate: (v: string) =>
      ["development", "test", "production"].includes(v)
        ? (v as "development" | "test" | "production")
        : ("development" as const),
  },
  DATABASE_URL: {
    key: "DATABASE_URL",
    required: true,
  },
  NEXTAUTH_SECRET: {
    key: "NEXTAUTH_SECRET",
    // Not required in dev (NextAuth generates one), required in prod
  },
  ENABLE_HEALTH_CHECKS: {
    key: "ENABLE_HEALTH_CHECKS",
    default: "true",
    validate: BOOLEAN,
  },
  LOG_LEVEL: {
    key: "LOG_LEVEL",
    default: "info",
    validate: (v: string) =>
      ["debug", "info", "warn", "error"].includes(v)
        ? (v as "debug" | "info" | "warn" | "error")
        : ("info" as const),
  },
} as const satisfies Record<string, EnvSchema<unknown>>;

type EnvShape = {
  NODE_ENV: "development" | "test" | "production";
  DATABASE_URL: string;
  NEXTAUTH_SECRET?: string;
  ENABLE_HEALTH_CHECKS: boolean;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
};

function loadEnv(): EnvShape {
  const result: Record<string, unknown> = {};

  for (const [name, schema] of Object.entries(schemas)) {
    const raw = process.env[schema.key] ?? schema.default;

    if (raw === undefined || raw === "") {
      if (schema.required) {
        throw new Error(
          `Missing required environment variable: ${schema.key}. ` +
            `Set it in .env or your deployment environment.`,
        );
      }
      continue;
    }

    result[name] = schema.validate ? schema.validate(raw) : raw;
  }

  // Warn (not fail) if NEXTAUTH_SECRET missing in production
  if (
    result.NODE_ENV === "production" &&
    !process.env.NEXTAUTH_SECRET
  ) {
    console.warn(
      "[env] NEXTAUTH_SECRET is not set in production. " +
        "Auth will use an insecure auto-generated secret.",
    );
  }

  return result as EnvShape;
}

/** Validated environment configuration. */
export const env = loadEnv();

/** True when running in production. */
export const isProduction = env.NODE_ENV === "production";

/** True when running in development. */
export const isDevelopment = env.NODE_ENV === "development";

/** True when running in test. */
export const isTest = env.NODE_ENV === "test";
