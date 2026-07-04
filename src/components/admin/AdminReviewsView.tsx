"use client";

import { useState, useMemo } from "react";
import { AdminLayout, StatusPill, AdminButton, AdminTable } from "./AdminLayout";
import { getFlaggedReviews, formatNumber, type FlaggedReview } from "@/lib/admin-data";
import {
  Check,
  X,
  AlertTriangle,
  Star,
  Search,
  ThumbsUp,
  Eye,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

type ReviewStatus = "flagged" | "pending" | "approved" | "rejected";

export function AdminReviewsView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Review Moderation | Admin · VerifiedBusiness.in");

  const initialFlagged = getFlaggedReviews();
  const [reviews, setReviews] = useState<(FlaggedReview & { status: ReviewStatus })[]>(
    () => initialFlagged.map((r) => ({ ...r, status: "flagged" as ReviewStatus })),
  );
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${r.businessName} ${r.review.author} ${r.review.text}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [reviews, filter, search]);

  const counts = useMemo(
    () => ({
      flagged: reviews.filter((r) => r.status === "flagged").length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    }),
    [reviews],
  );

  const setStatus = (id: string, status: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.review.id === id && r.businessId === id.split("-")[0]
          ? { ...r, status }
          : r,
      ),
    );
  };

  // The id in FlaggedReview is the review id, but we may have duplicates across businesses.
  // Use businessId + review.id as composite key
  const setReviewStatus = (businessId: string, reviewId: string, status: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.businessId === businessId && r.review.id === reviewId
          ? { ...r, status }
          : r,
      ),
    );
  };

  return (
    <AdminLayout
      activeView="admin-reviews"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Review moderation"
      subtitle={`${counts.flagged} flagged · ${counts.pending} pending · ${counts.approved} approved · ${counts.rejected} rejected`}
      actions={
        <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
          Back to dashboard
        </AdminButton>
      }
    >
      {/* Filter tabs */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div
          className="inline-flex p-0.5 rounded-[8px] shrink-0"
          style={{
            backgroundColor: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
          }}
        >
          {(["all", "flagged", "pending", "approved", "rejected"] as const).map((tab) => {
            const isActive = filter === tab;
            const count = tab === "all" ? reviews.length : counts[tab];
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all duration-150"
                style={{
                  backgroundColor: isActive ? "var(--color-surface)" : "transparent",
                  color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? "var(--shadow-xs)" : "none",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className="inline-flex items-center justify-center font-semibold"
                  style={{
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    borderRadius: 999,
                    backgroundColor: isActive ? "var(--color-accent-light)" : "var(--color-border)",
                    color: isActive ? "var(--color-accent)" : "var(--color-text-tertiary)",
                    fontSize: 10,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
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
            placeholder="Search reviews, authors, businesses..."
            className="w-full bg-transparent border-0 outline-none py-2.5"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          />
        </div>
      </div>

      {/* Reviews list (card-based, not table — better for long text) */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <ReviewCard
            key={`${item.businessId}-${item.review.id}`}
            item={item}
            onApprove={() => setReviewStatus(item.businessId, item.review.id, "approved")}
            onReject={() => setReviewStatus(item.businessId, item.review.id, "rejected")}
            onIgnore={() => setReviewStatus(item.businessId, item.review.id, "pending")}
          />
        ))}
        {filtered.length === 0 && (
          <div className="border border-dashed border-[var(--color-border-strong)] rounded-[12px] bg-[var(--color-surface)] p-12 text-center">
            <div
              className="mx-auto inline-flex items-center justify-center mb-3"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                backgroundColor: "var(--color-success-light)",
              }}
            >
              <Check size={24} strokeWidth={2.5} style={{ color: "var(--color-success)" }} />
            </div>
            <p
              className="font-display font-semibold"
              style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
            >
              All caught up
            </p>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              No reviews match this filter.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------------- Review card ---------------- */
function ReviewCard({
  item,
  onApprove,
  onReject,
  onIgnore,
}: {
  item: FlaggedReview & { status: ReviewStatus };
  onApprove: () => void;
  onReject: () => void;
  onIgnore: () => void;
}) {
  const statusColor: Record<ReviewStatus, string> = {
    flagged: "var(--color-warning)",
    pending: "var(--color-text-tertiary)",
    approved: "var(--color-success)",
    rejected: "var(--color-warning)",
  };

  return (
    <div
      className="border rounded-[12px] p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: item.status === "flagged" ? "var(--color-warning)" : "var(--color-border)",
        borderLeftWidth: item.status === "flagged" ? 4 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className="font-display font-semibold"
              style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
            >
              {item.businessName}
            </p>
            <span
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              ·
            </span>
            <span
              className="font-medium"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              {item.review.author}
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={11}
                  strokeWidth={2}
                  className={n <= item.review.rating ? "fill-[var(--color-warning)]" : "fill-none"}
                  style={{
                    color: n <= item.review.rating ? "var(--color-warning)" : "var(--color-border-strong)",
                  }}
                />
              ))}
            </div>
          </div>
          <p
            className="mt-1"
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            {item.review.date} · {item.review.helpful} found helpful
          </p>
        </div>
        <StatusPill
          status={
            item.status === "flagged" ? "pending" :
            item.status === "approved" ? "verified" :
            item.status === "rejected" ? "cancelled" : "free"
          }
          label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        />
      </div>

      {/* Flag reason */}
      {item.status === "flagged" && (
        <div
          className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "var(--color-warning-light)",
            border: "1px solid var(--color-warning)",
          }}
        >
          <AlertTriangle size={12} strokeWidth={2.5} style={{ color: "var(--color-warning)" }} />
          <span
            className="font-medium"
            style={{
              color: "var(--color-warning)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            {item.flagReason}
          </span>
        </div>
      )}

      {/* Review text */}
      <p
        className="mb-4"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "22px",
        }}
      >
        &ldquo;{item.review.text}&rdquo;
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {item.status !== "approved" && (
          <AdminButton variant="primary" size="sm" onClick={onApprove}>
            <Check size={14} strokeWidth={2.5} />
            Approve
          </AdminButton>
        )}
        {item.status !== "rejected" && (
          <AdminButton variant="danger" size="sm" onClick={onReject}>
            <X size={14} strokeWidth={2.5} />
            Reject
          </AdminButton>
        )}
        {item.status === "flagged" && (
          <AdminButton variant="ghost" size="sm" onClick={onIgnore}>
            <Eye size={14} strokeWidth={2.5} />
            Mark as pending
          </AdminButton>
        )}
      </div>
    </div>
  );
}
