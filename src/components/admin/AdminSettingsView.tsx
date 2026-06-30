"use client";

import { useState } from "react";
import { AdminLayout, AdminButton, StatusPill } from "./AdminLayout";
import { SUBSCRIPTION_PLANS } from "@/lib/directory-data";
import { formatINR } from "@/lib/admin-data";
import {
  CreditCard,
  BadgeCheck,
  Mail,
  ToggleLeft,
  Wrench,
  Check,
  Play,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";
import { logger } from "@/lib/logger";

export function AdminSettingsView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Settings | Admin · VerifiedBusiness.in");

  const [plans, setPlans] = useState({
    monthly: SUBSCRIPTION_PLANS.monthly.price,
    yearly: SUBSCRIPTION_PLANS.yearly.price,
  });

  const [features, setFeatures] = useState({
    autoApproveVerified: false,
    requireGstForPaid: true,
    emailOnExpiry: true,
    emailOnNewReview: true,
    publicReviews: true,
    aiModeration: false,
  });

  const [maintenanceRunning, setMaintenanceRunning] = useState(false);
  const [maintenanceResult, setMaintenanceResult] = useState<string | null>(null);

  const handleSavePlans = () => {
    logger.info("Admin updated subscription pricing", { plans });
    setMaintenanceResult("Pricing saved (demo — changes are local only)");
  };

  const handleToggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunMaintenance = async () => {
    setMaintenanceRunning(true);
    setMaintenanceResult(null);
    try {
      const res = await fetch("/api/maintenance/run", { method: "POST" });
      const data = await res.json();
      setMaintenanceResult(
        `Maintenance completed: ${data.healthReport?.status ?? "unknown"} · ${data.tasks?.length ?? 0} tasks · ${data.durationMs ?? 0}ms`,
      );
      logger.info("Admin triggered maintenance from settings", { result: data.healthReport?.status });
    } catch (err) {
      setMaintenanceResult(`Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setMaintenanceRunning(false);
    }
  };

  return (
    <AdminLayout
      activeView="admin-settings"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Settings"
      subtitle="Platform configuration and maintenance"
      actions={
        <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
          Back to dashboard
        </AdminButton>
      }
    >
      <div className="space-y-6">
        {/* Pricing */}
        <SettingsSection
          icon={CreditCard}
          title="Subscription pricing"
          description="Edit monthly and yearly plan amounts. Changes apply to new subscriptions only."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PricingInput
              label="Monthly plan"
              value={plans.monthly}
              onChange={(v) => setPlans((p) => ({ ...p, monthly: v }))}
              suffix="/mo"
            />
            <PricingInput
              label="Yearly plan"
              value={plans.yearly}
              onChange={(v) => setPlans((p) => ({ ...p, yearly: v }))}
              suffix="/yr"
            />
          </div>
          <div className="mt-4 p-3 rounded-[8px]" style={{ backgroundColor: "var(--color-accent-light)" }}>
            <p
              style={{
                color: "var(--color-accent)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
                lineHeight: "18px",
              }}
            >
              💡 Yearly saves {formatINR(plans.monthly * 12 - plans.yearly)} vs monthly.
              That's {Math.round((1 - plans.yearly / (plans.monthly * 12)) * 100)}% off.
            </p>
          </div>
          <div className="mt-4">
            <AdminButton variant="primary" size="sm" onClick={handleSavePlans}>
              <Check size={14} strokeWidth={2.5} />
              Save pricing
            </AdminButton>
          </div>
        </SettingsSection>

        {/* Verification criteria */}
        <SettingsSection
          icon={BadgeCheck}
          title="Verification criteria"
          description="Control what's required for a business to earn the Verified badge."
        >
          <div className="space-y-1">
            <ToggleRow
              label="Require GST for paid plans"
              description="Businesses on Monthly/Yearly must provide a valid GSTIN"
              checked={features.requireGstForPaid}
              onChange={() => handleToggleFeature("requireGstForPaid")}
            />
            <ToggleRow
              label="Auto-approve verified businesses"
              description="Skip manual review if GST + phone + address all validate"
              checked={features.autoApproveVerified}
              onChange={() => handleToggleFeature("autoApproveVerified")}
            />
            <ToggleRow
              label="AI moderation for reviews"
              description="Auto-flag reviews with toxic language using AI (beta)"
              checked={features.aiModeration}
              onChange={() => handleToggleFeature("aiModeration")}
            />
          </div>
        </SettingsSection>

        {/* Email templates */}
        <SettingsSection
          icon={Mail}
          title="Email notifications"
          description="Control when automated emails are sent to businesses."
        >
          <div className="space-y-1">
            <ToggleRow
              label="Expiry reminder (7 days before)"
              description="Send renewal reminder 7 days before subscription expires"
              checked={features.emailOnExpiry}
              onChange={() => handleToggleFeature("emailOnExpiry")}
            />
            <ToggleRow
              label="New review notification"
              description="Email business when a new review is published"
              checked={features.emailOnNewReview}
              onChange={() => handleToggleFeature("emailOnNewReview")}
            />
            <ToggleRow
              label="Public reviews"
              description="Show reviews publicly without admin pre-approval"
              checked={features.publicReviews}
              onChange={() => handleToggleFeature("publicReviews")}
            />
          </div>
        </SettingsSection>

        {/* Feature flags */}
        <SettingsSection
          icon={ToggleLeft}
          title="Feature flags"
          description="Enable or disable platform modules."
        >
          <div className="space-y-1">
            <ToggleRow
              label="Command palette (Cmd+K)"
              description="Quick search and navigation for power users"
              checked
              onChange={() => {}}
              disabled
            />
            <ToggleRow
              label="Photo gallery on detail pages"
              description="Show photo gallery + lightbox on business detail"
              checked
              onChange={() => {}}
              disabled
            />
            <ToggleRow
              label="Map view on listing pages"
              description="List/Map toggle on category listing page"
              checked
              onChange={() => {}}
              disabled
            />
            <ToggleRow
              label="Mobile bottom tab bar"
              description="Native-app-style bottom nav on mobile"
              checked
              onChange={() => {}}
              disabled
            />
          </div>
        </SettingsSection>

        {/* Maintenance */}
        <SettingsSection
          icon={Wrench}
          title="Maintenance & health"
          description="Trigger maintenance cycle and view latest health report."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleRunMaintenance}
                disabled={maintenanceRunning}
              >
                <Play size={14} strokeWidth={2.5} />
                {maintenanceRunning ? "Running..." : "Run maintenance now"}
              </AdminButton>
              <a
                href="/api/health?deep=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                View health report
              </a>
            </div>

            {maintenanceResult && (
              <div
                className="p-3 rounded-[8px] flex items-center gap-2"
                style={{
                  backgroundColor: "var(--color-accent-light)",
                  border: "1px solid var(--color-accent-border)",
                }}
              >
                <Check size={14} strokeWidth={2.5} style={{ color: "var(--color-accent)" }} />
                <p
                  className="font-medium"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {maintenanceResult}
                </p>
              </div>
            )}

            <div
              className="p-4 rounded-[8px]"
              style={{ backgroundColor: "var(--color-surface-2)" }}
            >
              <p
                className="font-medium mb-2"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                Scheduled maintenance
              </p>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                  lineHeight: "18px",
                }}
              >
                Runs automatically every 15 minutes. Performs health checks,
                cleans temp files, scans for recurring errors, and writes a
                health report to <code style={{ color: "var(--color-accent)" }}>.health/latest.json</code>.
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* Status footer */}
        <div
          className="flex items-center justify-between gap-4 p-4 rounded-[12px]"
          style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div>
            <p
              className="font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              Platform status
            </p>
            <p
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              All systems operational
            </p>
          </div>
          <StatusPill status="verified" label="Healthy" />
        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------------- Sub-components ---------------- */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="border rounded-[12px] bg-[var(--color-surface)] p-5"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className="shrink-0 inline-flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-accent-light)",
          }}
        >
          <Icon size={18} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
        </div>
        <div>
          <h2
            className="font-display font-semibold"
            style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
          >
            {title}
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
              lineHeight: "16px",
              marginTop: 2,
            }}
          >
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3 px-3 -mx-3 rounded-[8px] transition-colors"
      style={{
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="font-medium"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {label}
          {disabled && (
            <span
              className="ml-2 px-1.5 py-0.5 rounded font-medium"
              style={{
                backgroundColor: "var(--color-surface-2)",
                color: "var(--color-text-tertiary)",
                fontSize: 10,
              }}
            >
              ALWAYS ON
            </span>
          )}
        </p>
        <p
          className="mt-0.5"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
            lineHeight: "16px",
          }}
        >
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        aria-pressed={checked}
        aria-label={label}
        className="shrink-0 relative inline-flex items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed"
        style={{
          width: 40,
          height: 22,
          backgroundColor: checked ? "var(--color-accent)" : "var(--color-border-strong)",
        }}
      >
        <span
          className="inline-block rounded-full transition-transform duration-200"
          style={{
            width: 18,
            height: 18,
            backgroundColor: "#FFFFFF",
            transform: checked ? "translateX(20px)" : "translateX(2px)",
            boxShadow: "var(--shadow-xs)",
          }}
        />
      </button>
    </div>
  );
}

function PricingInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <div>
      <label
        className="block mb-1.5 font-medium"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-1 px-3 border rounded-[8px]"
        style={{
          backgroundColor: "var(--color-surface-2)",
          borderColor: "var(--color-border-strong)",
        }}
      >
        <span
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
          }}
        >
          ₹
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent border-0 outline-none py-2.5"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            fontWeight: 500,
          }}
        />
        <span
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          {suffix}
        </span>
      </div>
    </div>
  );
}
