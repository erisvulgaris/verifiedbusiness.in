"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Maximize2, Image as ImageIcon } from "lucide-react";

/**
 * PhotoGallery — premium gallery for business detail page.
 *
 * Spec-aligned design:
 *  - Main image: 16:9 aspect, rounded-lg, border
 *  - Thumbnail strip: 4-up grid below, active state with accent border
 *  - Lightbox modal: full-screen, prev/next, ESC to close, click outside to close
 *  - No autoplay (spec forbids auto-playing carousels)
 *  - Smooth transitions only (200ms ease)
 *
 * Uses deterministic SVG placeholders (no external images needed).
 */

interface GalleryPhoto {
  id: string;
  // Deterministic params for SVG placeholder
  hue: number;
  label: string;
  category: "interior" | "exterior" | "food" | "team" | "product" | "ambience";
}

function generatePhotos(seed: string, count: number): GalleryPhoto[] {
  const categories: GalleryPhoto["category"][] = ["exterior", "interior", "food", "ambience", "team", "product"];
  const labels = ["Front entrance", "Main hall", "Signature dish", "Ambience", "Our team", "Product range"];
  // Simple deterministic hash from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  const photos: GalleryPhoto[] = [];
  for (let i = 0; i < count; i++) {
    const h = (hash + i * 137) & 0xffff;
    const hue = h % 360;
    const catIdx = (h >> 8) % categories.length;
    photos.push({
      id: `${seed}-p${i}`,
      hue,
      label: labels[catIdx],
      category: categories[catIdx],
    });
  }
  return photos;
}

function PhotoPlaceholder({
  photo,
  className,
  showLabel = false,
}: {
  photo: GalleryPhoto;
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, hsl(${photo.hue}, 45%, 88%) 0%, hsl(${photo.hue + 20}, 35%, 75%) 100%)`,
      }}
    >
      {/* Subtle pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id={`pattern-${photo.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill={`hsl(${photo.hue}, 40%, 60%)`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pattern-${photo.id})`} />
      </svg>
      {/* Category icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="inline-flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <ImageIcon size={20} strokeWidth={2} style={{ color: `hsl(${photo.hue}, 40%, 40%)` }} />
        </div>
      </div>
      {showLabel && (
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2"
          style={{
            background: "linear-gradient(0deg, rgba(26,25,23,0.7) 0%, transparent 100%)",
          }}
        >
          <p
            className="font-medium"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            {photo.label}
          </p>
        </div>
      )}
    </div>
  );
}

export function PhotoGallery({
  businessId,
  businessName,
  photoCount = 6,
}: {
  businessId: string;
  businessName: string;
  photoCount?: number;
}) {
  const photos = generatePhotos(businessId, Math.max(4, Math.min(photoCount, 8)));
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const openLightbox = useCallback((idx: number) => {
    setActiveIndex(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-4">
        <h2
          className="font-display font-bold"
          style={{
            fontSize: "var(--text-xl)",
            letterSpacing: "-0.2px",
            color: "var(--color-text-primary)",
          }}
        >
          Photos
        </h2>
        <span
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {photos.length} photos
        </span>
      </div>

      {/* Main image */}
      <div
        className="relative border border-[var(--color-border)] rounded-[16px] overflow-hidden group cursor-pointer"
        onClick={() => openLightbox(activeIndex)}
        style={{ aspectRatio: "16 / 9" }}
      >
        <PhotoPlaceholder photo={photos[activeIndex]} className="w-full h-full" showLabel />

        {/* Expand button (top-right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(activeIndex);
          }}
          aria-label="Open full-screen gallery"
          className="absolute top-3 right-3 inline-flex items-center justify-center transition-all duration-150 hover:scale-105"
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            color: "var(--color-text-primary)",
          }}
        >
          <Maximize2 size={16} strokeWidth={2} />
        </button>

        {/* Prev / next (only if more than 1 photo) */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 hover:scale-105"
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(4px)",
                color: "var(--color-text-primary)",
              }}
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 hover:scale-105"
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(4px)",
                color: "var(--color-text-primary)",
              }}
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Counter (bottom-left) */}
        <div
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(26, 25, 23, 0.65)",
            backdropFilter: "blur(4px)",
          }}
        >
          <span
            className="font-medium"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
            }}
          >
            {activeIndex + 1} / {photos.length}
            {photos[activeIndex].label && ` · ${photos[activeIndex].label}`}
          </span>
        </div>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {photos.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`View photo ${i + 1}: ${p.label}`}
                aria-pressed={isActive}
                className={cn(
                  "relative overflow-hidden rounded-[8px] transition-all duration-200",
                  isActive
                    ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-surface)]"
                    : "opacity-70 hover:opacity-100",
                )}
                style={{ aspectRatio: "1 / 1" }}
              >
                <PhotoPlaceholder photo={p} className="w-full h-full" />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${businessName} photo gallery`}
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
          }}
          tabIndex={-1}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(26, 25, 23, 0.92)", backdropFilter: "blur(8px)" }}
          />
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close gallery"
            className="absolute top-4 right-4 z-10 inline-flex items-center justify-center transition-all duration-150 hover:scale-105"
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          {/* Counter */}
          <div
            className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <span
              className="font-medium"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              {activeIndex + 1} / {photos.length}
            </span>
          </div>
          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-4 z-10 inline-flex items-center justify-center transition-all duration-150 hover:scale-105"
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          {/* Main image */}
          <div
            className="relative max-w-5xl w-full mx-16"
            onClick={(e) => e.stopPropagation()}
            style={{ aspectRatio: "4 / 3" }}
          >
            <PhotoPlaceholder photo={photos[activeIndex]} className="w-full h-full rounded-[12px]" showLabel />
          </div>
          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
            className="absolute right-4 z-10 inline-flex items-center justify-center transition-all duration-150 hover:scale-105"
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
            }}
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </section>
  );
}
