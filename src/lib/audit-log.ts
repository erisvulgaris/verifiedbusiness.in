import { logger } from "@/lib/logger";

/**
 * Audit log system — tracks all admin actions for compliance + debugging.
 *
 * In production, audit logs would be persisted to a database table with
 * tamper-proof append-only storage. For now, we log via the structured
 * logger and keep an in-memory ring buffer for the admin UI.
 *
 * Usage:
 *   import { auditLog } from "@/lib/audit-log";
 *   auditLog.info("business.approved", { adminId: "admin-1", businessId: "b1" });
 */

export type AuditSeverity = "info" | "warning" | "critical";
export type AuditCategory =
  | "business"
  | "subscription"
  | "review"
  | "user"
  | "system"
  | "security"
  | "config";

export interface AuditEvent {
  id: string;
  timestamp: string;
  category: AuditCategory;
  action: string; // e.g., "business.approved"
  severity: AuditSeverity;
  actor: string; // admin ID or "system"
  target?: string; // affected entity ID
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

const RING_BUFFER_SIZE = 200;
const buffer: AuditEvent[] = [];

function generateId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function log(category: AuditCategory, action: string, severity: AuditSeverity, options?: {
  actor?: string;
  target?: string;
  details?: Record<string, unknown>;
  ip?: string;
}): void {
  const event: AuditEvent = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    category,
    action,
    severity,
    actor: options?.actor ?? "system",
    target: options?.target,
    details: options?.details,
    ip: options?.ip,
  };

  // Add to ring buffer
  buffer.unshift(event);
  if (buffer.length > RING_BUFFER_SIZE) buffer.pop();

  // Log via structured logger
  const logLevel = severity === "critical" ? "error" : severity === "warning" ? "warn" : "info";
  logger[logLevel](`Audit: ${action}`, {
    category,
    severity,
    actor: event.actor,
    target: event.target,
    ...event.details,
  });
}

export const auditLog = {
  info: (action: string, opts?: Parameters<typeof log>[3]) =>
    log(action.split(".")[0] as AuditCategory, action, "info", opts),
  warn: (action: string, opts?: Parameters<typeof log>[3]) =>
    log(action.split(".")[0] as AuditCategory, action, "warning", opts),
  critical: (action: string, opts?: Parameters<typeof log>[3]) =>
    log(action.split(".")[0] as AuditCategory, action, "critical", opts),

  /** Get recent audit events for the admin UI */
  getRecent: (limit = 50, filter?: { category?: AuditCategory; severity?: AuditSeverity }): AuditEvent[] => {
    let result = [...buffer];
    if (filter?.category) result = result.filter((e) => e.category === filter.category);
    if (filter?.severity) result = result.filter((e) => e.severity === filter.severity);
    return result.slice(0, limit);
  },

  /** Get count of events by category (for dashboard) */
  getCounts: (): Record<AuditCategory, number> => {
    const counts: Record<AuditCategory, number> = {
      business: 0,
      subscription: 0,
      review: 0,
      user: 0,
      system: 0,
      security: 0,
      config: 0,
    };
    for (const event of buffer) {
      counts[event.category]++;
    }
    return counts;
  },
};
