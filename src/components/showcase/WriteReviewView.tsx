"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { BUSINESSES } from "@/lib/directory-data";
import { Star, Check, ChevronLeft } from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";

export function WriteReviewView({
  businessId,
  onNavigateHome,
  onBack,
}: {
  businessId?: string;
  onNavigateHome?: () => void;
  onBack?: () => void;
}) {
  const business = BUSINESSES.find((b) => b.id === businessId) ?? BUSINESSES[0];
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = rating > 0 && review.length >= 20 && name.length >= 2;

  useDocumentTitle(`Write a review — ${business.name} | VerifiedBusiness.in`);

  if (submitted) {
    return (
      <div className="directory-container py-16 sm:py-24">
        <div className="max-w-xl mx-auto text-center">
          <div
            className="mx-auto inline-flex items-center justify-center mb-6"
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              backgroundColor: "var(--color-success-light)",
            }}
          >
            <Check size={32} strokeWidth={3} style={{ color: "var(--color-success)" }} />
          </div>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: "var(--text-3xl)",
              letterSpacing: "-0.3px",
              color: "var(--color-text-primary)",
            }}
          >
            Review submitted
          </h1>
          <p
            className="mt-3"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-lg)",
              lineHeight: "28px",
            }}
          >
            Thank you, {name}. Your review of <strong>{business.name}</strong>{" "}
            will appear publicly within 24 hours after moderation.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
            }}
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
            Back to {business.name}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: business.city, onClick: onNavigateHome },
          { label: business.name, onClick: onBack },
          { label: "Write a review" },
        ]}
      />

      <header className="mt-4 max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent)]"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Back to {business.name}
        </button>
        <h1
          className="mt-4 font-display font-bold"
          style={{
            fontSize: "clamp(var(--text-2xl), 5vw, var(--text-3xl))",
            lineHeight: "44px",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          Write a review
        </h1>
        <p
          className="mt-2"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-lg)",
            lineHeight: "28px",
          }}
        >
          Sharing your experience of <strong>{business.name}</strong> helps
          thousands of other users make better decisions.
        </p>
      </header>

      <div className="mt-8 max-w-2xl">
        <div className="border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-6 sm:p-8 space-y-6">
          {/* Rating */}
          <div>
            <label
              className="block mb-3 font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              Your rating <span style={{ color: "var(--color-warning)" }}>*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = n <= (hover || rating);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
                    className="transition-transform duration-150 hover:scale-110"
                  >
                    <Star
                      size={32}
                      strokeWidth={2}
                      className={filled ? "fill-[var(--color-warning)]" : "fill-none"}
                      style={{
                        color: filled ? "var(--color-warning)" : "var(--color-border-strong)",
                      }}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span
                  className="ml-2 font-display font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-lg)",
                  }}
                >
                  {["", "Terrible", "Poor", "OK", "Good", "Excellent"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              className="block mb-1.5 font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              Review title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 80))}
              placeholder="Summarise your experience in a line"
              className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
              }}
            />
          </div>

          {/* Review body */}
          <div>
            <label
              className="block mb-1.5 font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              Your review <span style={{ color: "var(--color-warning)" }}>*</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 1000))}
              rows={5}
              placeholder={`What did you order or use? How was the service? Would you recommend ${business.name} to others?`}
              className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none transition-colors resize-none"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            />
            <p
              className="mt-1 text-right"
              style={{
                color: review.length < 20 ? "var(--color-warning)" : "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              {review.length < 20 ? `${20 - review.length} more characters needed` : `${review.length}/1000`}
            </p>
          </div>

          {/* Reviewer name */}
          <div>
            <label
              className="block mb-1.5 font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              Your name <span style={{ color: "var(--color-warning)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="This will appear publicly with your review"
              className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
              }}
            />
          </div>

          {/* Guidelines */}
          <div
            className="border rounded-[10px] p-4"
            style={{
              backgroundColor: "var(--color-surface-2)",
              borderColor: "var(--color-border)",
            }}
          >
            <p
              className="font-medium mb-2"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              Review guidelines
            </p>
            <ul className="space-y-1.5">
              {[
                "Be honest and specific about your experience.",
                "No abusive language, personal attacks, or promotional content.",
                "Don't share personal information about staff or other customers.",
                "Reviews are moderated within 24 hours.",
              ].map((g, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                    lineHeight: "16px",
                  }}
                >
                  <Check size={12} strokeWidth={2.5} style={{ color: "var(--color-success)", marginTop: 2 }} />
                  {g}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => canSubmit && setSubmitted(true)}
              disabled={!canSubmit}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[8px] transition-all duration-150 hover:shadow-[var(--shadow-md)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-jakarta), sans-serif",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
              }}
            >
              <Check size={14} strokeWidth={2.5} />
              Submit review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
