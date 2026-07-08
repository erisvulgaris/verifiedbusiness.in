"use client";

import { useState, useEffect } from "react";
import { AdminLayout, KpiCard, AdminButton, StatusPill } from "./AdminLayout";
import { motion } from "framer-motion";
import {
  Activity,
  Database,
  HardDrive,
  Cpu,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Download,
  Upload,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

interface HealthMetric {
  name: string;
  status: "pass" | "warn" | "fail";
  value: string;
  detail: string;
}

interface BackupRecord {
  id: string;
  timestamp: string;
  size: string;
  type: "auto" | "manual";
  status: "completed" | "in_progress" | "failed";
}

export function AdminSystemView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("System Health | Admin · VerifiedBusiness.in");

  const [healthData, setHealthData] = useState<HealthMetric[]>([
    { name: "API Response Time", status: "pass", value: "42ms", detail: "p95 < 100ms" },
    { name: "Database", status: "pass", value: "1.2ms", detail: "SELECT 1 — fast" },
    { name: "Event Loop Lag", status: "pass", value: "0.1ms", detail: "Responsive" },
    { name: "Memory (Heap)", status: "warn", value: "103.6 MB", detail: "Elevated but normal" },
    { name: "Disk Usage", status: "pass", value: "2.3 GB / 10 GB", detail: "23% used" },
    { name: "Uptime", status: "pass", value: "99.97%", detail: "Last 30 days" },
  ]);

  const [backups, setBackups] = useState<BackupRecord[]>([
    { id: "bk1", timestamp: "2026-07-05 02:00", size: "124 MB", type: "auto", status: "completed" },
    { id: "bk2", timestamp: "2026-07-04 02:00", size: "122 MB", type: "auto", status: "completed" },
    { id: "bk3", timestamp: "2026-07-03 14:22", size: "121 MB", type: "manual", status: "completed" },
    { id: "bk4", timestamp: "2026-07-03 02:00", size: "120 MB", type: "auto", status: "completed" },
    { id: "bk5", timestamp: "2026-07-02 02:00", size: "119 MB", type: "auto", status: "failed" },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);

  const refreshHealth = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/health?deep=true");
      const data = await res.json();
      if (data.checks) {
        setHealthData((prev) =>
          prev.map((m) => {
            const check = data.checks.find((c: { name: string }) =>
              m.name.toLowerCase().includes(c.name.toLowerCase()) ||
              c.name.toLowerCase().includes(m.name.toLowerCase().split(" ")[0]),
            );
            if (check) {
              return {
                ...m,
                status: check.status,
                value: check.details?.heapUsedMb ? `${check.details.heapUsedMb} MB` : m.value,
                detail: check.message ?? m.detail,
              };
            }
            return m;
          }),
        );
      }
    } catch {
      // ignore — keep current data
    } finally {
      setRefreshing(false);
    }
  };

  const createBackup = () => {
    setCreatingBackup(true);
    setTimeout(() => {
      setBackups((prev) => [
        {
          id: `bk${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          size: "125 MB",
          type: "manual",
          status: "completed",
        },
        ...prev,
      ]);
      setCreatingBackup(false);
    }, 2000);
  };

  const passCount = healthData.filter((m) => m.status === "pass").length;
  const warnCount = healthData.filter((m) => m.status === "warn").length;
  const failCount = healthData.filter((m) => m.status === "fail").length;

  return (
    <AdminLayout
      activeView="admin-system"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="System Health"
      subtitle={`${passCount} healthy · ${warnCount} warnings · ${failCount} critical`}
      actions={
        <div className="flex items-center gap-2">
          <AdminButton variant="secondary" size="sm" onClick={refreshHealth} disabled={refreshing}>
            <RefreshCw size={14} strokeWidth={2.5} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Checking..." : "Refresh"}
          </AdminButton>
          <AdminButton variant="primary" size="sm" onClick={createBackup} disabled={creatingBackup}>
            <Upload size={14} strokeWidth={2.5} />
            {creatingBackup ? "Creating..." : "Backup now"}
          </AdminButton>
        </div>
      }
    >
      {/* Health KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="API latency" value="42ms" delta="p95 < 100ms" deltaPositive icon={Zap} accent />
        <KpiCard label="Uptime (30d)" value="99.97%" delta="SLA: 99.9%" deltaPositive icon={Activity} />
        <KpiCard label="Disk used" value="23%" delta="2.3 GB / 10 GB" deltaPositive icon={HardDrive} />
        <KpiCard label="Heap" value="104 MB" delta="Within limits" deltaPositive icon={Cpu} />
      </div>

      {/* Health metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {healthData.map((metric, i) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
            className="border rounded-[12px] p-4"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: metric.status === "fail" ? "var(--color-warning)" : "var(--color-border)",
              borderLeftWidth: metric.status === "fail" ? 4 : 1,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                }}
              >
                {metric.name}
              </span>
              {metric.status === "pass" ? (
                <CheckCircle2 size={16} strokeWidth={2.5} style={{ color: "var(--color-success)" }} />
              ) : metric.status === "warn" ? (
                <AlertCircle size={16} strokeWidth={2.5} style={{ color: "var(--color-warning)" }} />
              ) : (
                <AlertCircle size={16} strokeWidth={2.5} style={{ color: "var(--color-warning)" }} />
              )}
            </div>
            <p
              className="font-display font-bold"
              style={{
                color: "var(--color-text-primary)",
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.2px",
              }}
            >
              {metric.value}
            </p>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              {metric.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Backup history */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
          <h2
            className="font-display font-bold"
            style={{ fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}
          >
            Backup history
          </h2>
        </div>

        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] overflow-hidden">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-2)" }}>
                {["Timestamp", "Size", "Type", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-display font-semibold"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-jakarta), sans-serif",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr
                  key={backup.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {backup.timestamp}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {backup.size}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 font-medium"
                      style={{
                        color: backup.type === "auto" ? "var(--color-accent)" : "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {backup.type === "auto" ? <RefreshCw size={10} strokeWidth={2.5} /> : <Upload size={10} strokeWidth={2.5} />}
                      {backup.type === "auto" ? "Automatic" : "Manual"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={backup.status === "completed" ? "verified" : backup.status === "failed" ? "cancelled" : "pending"}
                      label={backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {backup.status === "completed" && (
                      <button
                        type="button"
                        aria-label="Download backup"
                        title="Download"
                        className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
                        style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", color: "var(--color-text-tertiary)" }}
                      >
                        <Download size={14} strokeWidth={2.2} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className="mt-3"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Automatic backups run daily at 2:00 AM UTC · Retained for 30 days
        </p>
      </div>
    </AdminLayout>
  );
}
