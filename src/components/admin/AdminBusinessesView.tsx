"use client";

import { useState, useMemo } from "react";
import { AdminLayout, StatusPill, AdminButton, AdminTable } from "./AdminLayout";
import { BUSINESSES, SUBSCRIPTION_PLANS, type Business, type SubscriptionPlan } from "@/lib/directory-data";
import { formatINR } from "@/lib/admin-data";
import {
  Search,
  Check,
  X,
  MoreHorizontal,
  Trash2,
  PencilLine,
  CreditCard,
  BadgeCheck,
  Eye,
  Star,
  Download,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";
import { exportToCsv } from "@/lib/csv-export";

export function AdminBusinessesView({
  onViewChange,
  onExitAdmin,
  onOpenBusiness,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
  onOpenBusiness?: (id: string) => void;
}) {
  useDocumentTitle("Manage Businesses | Admin · VerifiedBusiness.in");

  // Local working copy so admin actions reflect immediately (demo)
  const [businesses, setBusinesses] = useState<Business[]>(() =>
    BUSINESSES.map((b) => ({ ...b })),
  );
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState<"all" | "verified" | "unverified">("all");
  const [filterPlan, setFilterPlan] = useState<"all" | SubscriptionPlan>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editTarget, setEditTarget] = useState<Business | null>(null);
  const [subTarget, setSubTarget] = useState<Business | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);

  // Filter
  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${b.name} ${b.category} ${b.city} ${b.locality} ${b.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filterVerified === "verified" && !b.verified) return false;
      if (filterVerified === "unverified" && b.verified) return false;
      if (filterPlan !== "all" && b.subscription.plan !== filterPlan) return false;
      return true;
    });
  }, [businesses, search, filterVerified, filterPlan]);

  // Actions
  const toggleVerified = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, verified: !b.verified } : b)),
    );
  };

  const handleDelete = (id: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    setDeleteTarget(null);
  };

  const handleSaveEdit = (updated: Business) => {
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setEditTarget(null);
  };

  const handleChangeSubscription = (id: string, plan: SubscriptionPlan) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const planConfig = SUBSCRIPTION_PLANS[plan];
        const now = new Date();
        const end = new Date(now.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);
        return {
          ...b,
          verified: plan !== "free" ? true : b.verified,
          subscription: {
            plan,
            status: plan === "free" ? "active" : "active",
            startDate: now.toISOString().slice(0, 10),
            endDate: plan === "free" ? "" : end.toISOString().slice(0, 10),
            amount: planConfig.price,
            autoRenew: plan !== "free",
          },
        };
      }),
    );
    setSubTarget(null);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((b) => b.id));
    });
  };

  const bulkVerify = () => {
    setBusinesses((prev) =>
      prev.map((b) => (selected.has(b.id) ? { ...b, verified: true } : b)),
    );
    setSelected(new Set());
  };

  const bulkDelete = () => {
    setBusinesses((prev) => prev.filter((b) => !selected.has(b.id)));
    setSelected(new Set());
  };

  return (
    <AdminLayout
      activeView="admin-businesses"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Businesses"
      subtitle={`${filtered.length} of ${businesses.length} businesses`}
      actions={
        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => {
              exportToCsv(`verifiedbusiness-listings-${Date.now()}.csv`, filtered, [
                { key: "name", label: "Business Name" },
                { key: "category", label: "Category" },
                { key: "city", label: "City" },
                { key: "phone", label: "Phone" },
                { key: "rating", label: "Rating" },
                { key: "reviewCount", label: "Reviews" },
                { key: "verified", label: "Verified", format: (b) => (b.verified ? "Yes" : "No") },
                { key: "subscription.plan", label: "Plan", format: (b) => b.subscription.plan },
                { key: "subscription.status", label: "Status", format: (b) => b.subscription.status },
                { key: "subscription.amount", label: "Amount (₹)", format: (b) => b.subscription.amount },
              ]);
            }}
          >
            <Download size={14} strokeWidth={2.5} />
            Export CSV
          </AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
            Back to dashboard
          </AdminButton>
        </div>
      }
    >
      {/* Filter bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 flex-1 border rounded-[8px]"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <Search size={16} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, city, phone..."
            className="w-full bg-transparent border-0 outline-none py-2.5"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          />
        </div>
        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value as typeof filterVerified)}
          className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <option value="all">All verification</option>
          <option value="verified">Verified only</option>
          <option value="unverified">Unverified only</option>
        </select>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value as typeof filterPlan)}
          className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div
          className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-[8px]"
          style={{ backgroundColor: "var(--color-accent-light)", border: "1px solid var(--color-accent-border)" }}
        >
          <span
            className="font-medium"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          >
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <AdminButton variant="secondary" size="sm" onClick={bulkVerify}>
              <BadgeCheck size={14} strokeWidth={2.5} />
              Verify all
            </AdminButton>
            <AdminButton variant="danger" size="sm" onClick={bulkDelete}>
              <Trash2 size={14} strokeWidth={2.5} />
              Delete all
            </AdminButton>
            <AdminButton variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </AdminButton>
          </div>
        </div>
      )}

      {/* Table */}
      <AdminTable headers={["", "Business", "Category", "City", "Rating", "Verified", "Plan", "Status", "Actions"]}>
        {filtered.map((b) => (
          <tr
            key={b.id}
            className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            {/* Checkbox */}
            <td className="px-4 py-3">
              <input
                type="checkbox"
                checked={selected.has(b.id)}
                onChange={() => toggleSelect(b.id)}
                aria-label={`Select ${b.name}`}
                style={{ accentColor: "var(--color-accent)", width: 16, height: 16 }}
              />
            </td>
            {/* Business */}
            <td className="px-4 py-3">
              <button
                type="button"
                onClick={() => onOpenBusiness?.(b.id)}
                className="text-left"
              >
                <p
                  className="font-medium"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {b.name}
                </p>
                <p
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {b.phone}
                </p>
              </button>
            </td>
            {/* Category */}
            <td className="px-4 py-3">
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                {b.category}
              </span>
            </td>
            {/* City */}
            <td className="px-4 py-3">
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                {b.city}
              </span>
            </td>
            {/* Rating */}
            <td className="px-4 py-3">
              <span
                className="inline-flex items-center gap-1"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <Star size={12} strokeWidth={2.2} className="fill-[var(--color-warning)]" style={{ color: "var(--color-warning)" }} />
                {b.rating.toFixed(1)}
              </span>
            </td>
            {/* Verified */}
            <td className="px-4 py-3">
              <StatusPill
                status={b.verified ? "verified" : "unverified"}
                label={b.verified ? "Verified" : "Unverified"}
              />
            </td>
            {/* Plan */}
            <td className="px-4 py-3">
              <span
                className="font-medium"
                style={{
                  color: b.subscription.plan === "free" ? "var(--color-text-tertiary)" : "var(--color-accent)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                {SUBSCRIPTION_PLANS[b.subscription.plan].label}
              </span>
            </td>
            {/* Status */}
            <td className="px-4 py-3">
              <StatusPill status={b.subscription.status} label={b.subscription.status.charAt(0).toUpperCase() + b.subscription.status.slice(1)} />
            </td>
            {/* Actions */}
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <IconActionButton
                  icon={Eye}
                  label="View"
                  onClick={() => onOpenBusiness?.(b.id)}
                />
                <IconActionButton
                  icon={BadgeCheck}
                  label={b.verified ? "Unverify" : "Verify"}
                  onClick={() => toggleVerified(b.id)}
                  active={b.verified}
                />
                <IconActionButton
                  icon={CreditCard}
                  label="Subscription"
                  onClick={() => setSubTarget(b)}
                />
                <IconActionButton
                  icon={PencilLine}
                  label="Edit"
                  onClick={() => setEditTarget(b)}
                />
                <IconActionButton
                  icon={Trash2}
                  label="Delete"
                  onClick={() => setDeleteTarget(b)}
                  danger
                />
              </div>
            </td>
          </tr>
        ))}
        {filtered.length === 0 && (
          <tr>
            <td colSpan={9} className="px-4 py-12 text-center">
              <p
                className="font-display font-semibold"
                style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
              >
                No businesses match your filters
              </p>
              <p
                className="mt-1"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                Try adjusting your search or filters.
              </p>
            </td>
          </tr>
        )}
      </AdminTable>

      {/* Select all row */}
      {filtered.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            {selected.size === filtered.length ? "Deselect all" : `Select all ${filtered.length}`}
          </button>
          <span
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            Showing {filtered.length} of {businesses.length}
          </span>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditBusinessModal
          business={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Subscription modal */}
      {subTarget && (
        <SubscriptionModal
          business={subTarget}
          onChange={handleChangeSubscription}
          onClose={() => setSubTarget(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          business={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}

/* ---------------- Icon action button ---------------- */
function IconActionButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  danger = false,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
      style={{
        width: 28,
        height: 28,
        borderRadius: "var(--radius-sm)",
        color: danger
          ? "var(--color-warning)"
          : active
            ? "var(--color-success)"
            : "var(--color-text-tertiary)",
      }}
    >
      <Icon size={14} strokeWidth={2.2} />
    </button>
  );
}

/* ---------------- Edit modal ---------------- */
function EditBusinessModal({
  business,
  onSave,
  onClose,
}: {
  business: Business;
  onSave: (b: Business) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: business.name,
    phone: business.phone,
    email: business.email ?? "",
    website: business.website ?? "",
    hours: business.hours,
    address: business.address,
    description: business.description,
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal onClose={onClose} title="Edit business" size="md">
      <div className="space-y-4">
        <Field label="Business name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)]"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)]"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                borderColor: "var(--color-border-strong)",
              }}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)]"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                borderColor: "var(--color-border-strong)",
              }}
            />
          </Field>
        </div>
        <Field label="Website">
          <input
            type="text"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)]"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          />
        </Field>
        <Field label="Hours">
          <input
            type="text"
            value={form.hours}
            onChange={(e) => update("hours", e.target.value)}
            className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)]"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          />
        </Field>
        <Field label="Address">
          <textarea
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)] resize-none"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface)] resize-none"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          />
        </Field>
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        <AdminButton variant="secondary" size="sm" onClick={onClose}>Cancel</AdminButton>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={() => onSave({ ...business, ...form })}
        >
          <Check size={14} strokeWidth={2.5} />
          Save changes
        </AdminButton>
      </div>
    </Modal>
  );
}

/* ---------------- Subscription modal ---------------- */
function SubscriptionModal({
  business,
  onChange,
  onClose,
}: {
  business: Business;
  onChange: (id: string, plan: SubscriptionPlan) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} title={`Manage subscription · ${business.name}`} size="md">
      <p
        className="mb-4"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "20px",
        }}
      >
        Current plan: <strong style={{ color: "var(--color-text-primary)" }}>{SUBSCRIPTION_PLANS[business.subscription.plan].label}</strong>
        {business.subscription.plan !== "free" && (
          <>
            {" "}· Status: <strong style={{ color: "var(--color-text-primary)" }}>{business.subscription.status}</strong>
            {" "}· Amount: <strong style={{ color: "var(--color-text-primary)" }}>{formatINR(business.subscription.amount)}</strong>
          </>
        )}
      </p>
      <div className="space-y-3">
        {(Object.values(SUBSCRIPTION_PLANS)).map((plan) => {
          const isCurrent = business.subscription.plan === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange(business.id, plan.id)}
              disabled={isCurrent}
              className="w-full flex items-start justify-between gap-3 p-4 border rounded-[10px] text-left transition-all duration-150 hover:border-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isCurrent ? "var(--color-accent-light)" : "var(--color-surface)",
                borderColor: isCurrent ? "var(--color-accent-border)" : "var(--color-border)",
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className="font-display font-semibold"
                    style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
                  >
                    {plan.label}
                  </p>
                  {isCurrent && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--color-success)",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                      CURRENT
                    </span>
                  )}
                </div>
                <p
                  className="mt-1"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {plan.features.slice(0, 2).join(" · ")}
                </p>
              </div>
              <p
                className="font-display font-bold shrink-0"
                style={{ color: "var(--color-accent)", fontSize: "var(--text-lg)" }}
              >
                {plan.price === 0 ? "₹0" : formatINR(plan.price)}
                {plan.durationDays > 0 && (
                  <span
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                      fontWeight: 400,
                    }}
                  >
                    {" "}/{plan.durationDays === 30 ? "mo" : "yr"}
                  </span>
                )}
              </p>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        <AdminButton variant="secondary" size="sm" onClick={onClose}>Close</AdminButton>
      </div>
    </Modal>
  );
}

/* ---------------- Delete confirm ---------------- */
function DeleteConfirmModal({
  business,
  onConfirm,
  onClose,
}: {
  business: Business;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} title="Delete business?" size="sm">
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "22px",
        }}
      >
        Are you sure you want to permanently delete{" "}
        <strong style={{ color: "var(--color-text-primary)" }}>{business.name}</strong>?
        This will also remove all associated reviews, photos, and subscription history.
        This action cannot be undone.
      </p>
      <div className="mt-6 flex items-center justify-end gap-2">
        <AdminButton variant="secondary" size="sm" onClick={onClose}>Cancel</AdminButton>
        <AdminButton variant="danger" size="sm" onClick={onConfirm}>
          <Trash2 size={14} strokeWidth={2.5} />
          Delete permanently
        </AdminButton>
      </div>
    </Modal>
  );
}

/* ---------------- Modal primitive ---------------- */
function Modal({
  onClose,
  title,
  size = "md",
  children,
}: {
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  const maxWidth = size === "sm" ? "400px" : size === "lg" ? "720px" : "560px";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26, 25, 23, 0.5)", backdropFilter: "blur(4px)" }}
      />
      <div
        className="relative w-full max-h-[90vh] overflow-y-auto border rounded-[16px]"
        style={{
          maxWidth,
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "var(--text-lg)",
              letterSpacing: "-0.2px",
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Field primitive ---------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
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
      {children}
    </div>
  );
}
