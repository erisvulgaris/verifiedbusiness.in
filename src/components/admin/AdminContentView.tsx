"use client";

import { useState } from "react";
import { AdminLayout, AdminButton, StatusPill } from "./AdminLayout";
import { motion } from "framer-motion";
import {
  Flag,
  FileText,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

interface FeatureFlag {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  category: "ui" | "search" | "monetization" | "admin" | "experimental";
}

interface ContentBlock {
  id: string;
  key: string;
  label: string;
  content: string;
  lastUpdated: string;
}

const INITIAL_FLAGS: FeatureFlag[] = [
  { id: "f1", key: "command_palette", label: "Command Palette", description: "Cmd+K quick search and navigation", enabled: true, category: "ui" },
  { id: "f2", key: "photo_gallery", label: "Photo Gallery", description: "Show photo gallery + lightbox on business detail", enabled: true, category: "ui" },
  { id: "f3", key: "map_view", label: "Map View", description: "List/Map toggle on category listing page", enabled: true, category: "ui" },
  { id: "f4", key: "mobile_tab_bar", label: "Mobile Tab Bar", description: "Native-app-style bottom nav on mobile", enabled: true, category: "ui" },
  { id: "f5", key: "ai_search", label: "AI Search Suggestions", description: "AI-powered search query suggestions (beta)", enabled: false, category: "search" },
  { id: "f6", key: "voice_search", label: "Voice Search", description: "Microphone input for search queries", enabled: false, category: "search" },
  { id: "f7", key: "paid_listings", label: "Paid Listings", description: "Enable subscription-based listing tiers", enabled: true, category: "monetization" },
  { id: "f8", key: "featured_badge", label: "Featured Badge", description: "Show ★ Featured badge for yearly subscribers", enabled: true, category: "monetization" },
  { id: "f9", key: "ai_moderation", label: "AI Review Moderation", description: "Auto-flag reviews with AI (beta)", enabled: false, category: "experimental" },
  { id: "f10", key: "batch_import", label: "Batch CSV Import", description: "Allow businesses to import listings via CSV", enabled: false, category: "experimental" },
];

const INITIAL_CONTENT: ContentBlock[] = [
  { id: "c1", key: "hero_title", label: "Homepage Hero Title", content: "Find the right local business, anywhere in India.", lastUpdated: "2026-07-01" },
  { id: "c2", key: "hero_subtitle", label: "Homepage Hero Subtitle", content: "Verified listings across all 28 states, 780+ districts, and 19,000+ pincodes.", lastUpdated: "2026-07-01" },
  { id: "c3", key: "cta_title", label: "List Business CTA Title", content: "List your business for free", lastUpdated: "2026-06-15" },
  { id: "c4", key: "footer_copyright", label: "Footer Copyright", content: "© 2026 VerifiedBusiness.in · Made in India · Light Mode v1.0", lastUpdated: "2026-01-01" },
  { id: "c5", key: "welcome_email", label: "Welcome Email Subject", content: "Welcome to VerifiedBusiness.in — your listing is being reviewed", lastUpdated: "2026-06-20" },
];

export function AdminContentView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Feature Flags & Content | Admin · VerifiedBusiness.in");

  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);
  const [content, setContent] = useState<ContentBlock[]>(INITIAL_CONTENT);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const toggleFlag = (id: string) => {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const startEdit = (block: ContentBlock) => {
    setEditingContent(block.id);
    setEditValue(block.content);
  };

  const saveEdit = (id: string) => {
    setContent((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, content: editValue, lastUpdated: new Date().toISOString().slice(0, 10) }
          : c,
      ),
    );
    setEditingContent(null);
  };

  const categoryColors: Record<FeatureFlag["category"], string> = {
    ui: "var(--color-accent)",
    search: "var(--color-success)",
    monetization: "var(--color-warning)",
    admin: "var(--color-text-tertiary)",
    experimental: "#8B5CF6",
  };

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <AdminLayout
      activeView="admin-content"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Feature Flags & Content"
      subtitle={`${enabledCount} of ${flags.length} features enabled · ${content.length} content blocks`}
      actions={
        <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
          Back to dashboard
        </AdminButton>
      }
    >
      {/* Feature flags section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Flag size={18} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
          <h2
            className="font-display font-bold"
            style={{ fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}
          >
            Feature flags
          </h2>
        </div>

        {/* Category summary */}
        <div className="mb-4 flex flex-wrap gap-3">
          {(["ui", "search", "monetization", "experimental"] as const).map((cat) => {
            const count = flags.filter((f) => f.category === cat && f.enabled).length;
            const total = flags.filter((f) => f.category === cat).length;
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                <span
                  className="inline-block"
                  style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: categoryColors[cat] }}
                />
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}: {count}/{total}
                </span>
              </span>
            );
          })}
        </div>

        {/* Flag list */}
        <div className="space-y-2">
          {flags.map((flag) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center justify-between gap-4 py-3 px-4 border rounded-[10px] hover:bg-[var(--color-surface-2)] transition-colors"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                opacity: flag.enabled ? 1 : 0.7,
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className="inline-block shrink-0"
                  style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: categoryColors[flag.category] }}
                />
                <div className="min-w-0">
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {flag.label}
                    {flag.category === "experimental" && (
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: "rgba(139, 92, 246, 0.1)",
                          color: "#8B5CF6",
                          fontSize: 10,
                        }}
                      >
                        BETA
                      </span>
                    )}
                  </p>
                  <p
                    className="mt-0.5"
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {flag.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleFlag(flag.id)}
                aria-pressed={flag.enabled}
                aria-label={`Toggle ${flag.label}`}
                className="shrink-0 relative inline-flex items-center rounded-full transition-colors duration-200"
                style={{
                  width: 44,
                  height: 24,
                  backgroundColor: flag.enabled ? "var(--color-accent)" : "var(--color-border-strong)",
                }}
              >
                <motion.span
                  className="inline-block rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "var(--shadow-xs)",
                  }}
                  animate={{ x: flag.enabled ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content management section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
          <h2
            className="font-display font-bold"
            style={{ fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}
          >
            Content blocks
          </h2>
        </div>

        <div className="space-y-3">
          {content.map((block) => (
            <div
              key={block.id}
              className="border rounded-[10px] p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {block.label}
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11,
                    }}
                  >
                    {block.key} · updated {block.lastUpdated}
                  </p>
                </div>
                {editingContent === block.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => saveEdit(block.id)}
                      aria-label="Save"
                      className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
                      style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", color: "var(--color-success)" }}
                    >
                      <Save size={14} strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingContent(null)}
                      aria-label="Cancel"
                      className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
                      style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", color: "var(--color-text-tertiary)" }}
                    >
                      <X size={14} strokeWidth={2.2} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(block)}
                    aria-label="Edit"
                    className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
                    style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", color: "var(--color-text-tertiary)" }}
                  >
                    <Edit3 size={14} strokeWidth={2.2} />
                  </button>
                )}
              </div>
              {editingContent === block.id ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={2}
                  autoFocus
                  className="w-full px-3 py-2 border rounded-[8px] bg-[var(--color-surface-2)] resize-none"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                    borderColor: "var(--color-accent-border)",
                  }}
                />
              ) : (
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                    lineHeight: "22px",
                  }}
                >
                  {block.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
