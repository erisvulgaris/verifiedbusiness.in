"use client";

import { useState, useMemo } from "react";
import { AdminLayout, KpiCard, AdminButton, AdminTable, StatusPill } from "./AdminLayout";
import { motion } from "framer-motion";
import {
  LifeBuoy,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Send,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

interface SupportTicket {
  id: string;
  subject: string;
  from: string;
  businessName?: string;
  category: "billing" | "listing" | "technical" | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "resolved" | "closed";
  createdAt: string;
  lastReply: string;
  messageCount: number;
}

const INITIAL_TICKETS: SupportTicket[] = [
  { id: "t1", subject: "Subscription not activating after payment", from: "sankalp@restaurant.in", businessName: "Sankalp Restaurant", category: "billing", priority: "urgent", status: "open", createdAt: "2026-07-05 02:15", lastReply: "2 min ago", messageCount: 1 },
  { id: "t2", subject: "How to add more photos to my listing?", from: "aster@cmi.in", businessName: "Aster CMI Hospital", category: "listing", priority: "low", status: "pending", createdAt: "2026-07-04 18:30", lastReply: "6 hours ago", messageCount: 3 },
  { id: "t3", subject: "Map showing wrong location", from: "carz@hub.in", businessName: "Carz Service Hub", category: "technical", priority: "high", status: "open", createdAt: "2026-07-04 14:00", lastReply: "1 day ago", messageCount: 2 },
  { id: "t4", subject: "Request to verify my business", from: "anand@sweets.in", businessName: "Anand Sweets", category: "listing", priority: "medium", status: "resolved", createdAt: "2026-07-03 10:00", lastReply: "2 days ago", messageCount: 5 },
  { id: "t5", subject: "Annual invoice for tax filing", from: "legal@khaitan.com", businessName: "Khaitan & Co", category: "billing", priority: "medium", status: "closed", createdAt: "2026-06-28 09:00", lastReply: "1 week ago", messageCount: 4 },
  { id: "t6", subject: "Cannot login to dashboard", from: "rohan@verifiedbusiness.in", category: "technical", priority: "high", status: "pending", createdAt: "2026-07-04 20:00", lastReply: "4 hours ago", messageCount: 2 },
];

const PRIORITY_COLORS: Record<SupportTicket["priority"], string> = {
  urgent: "var(--color-warning)",
  high: "var(--color-accent)",
  medium: "var(--color-text-secondary)",
  low: "var(--color-text-tertiary)",
};

const CATEGORY_LABELS: Record<SupportTicket["category"], string> = {
  billing: "Billing",
  listing: "Listing",
  technical: "Technical",
  general: "General",
};

export function AdminSupportView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Customer Support | Admin · VerifiedBusiness.in");

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | SupportTicket["status"]>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | SupportTicket["priority"]>("all");

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (!t.subject.toLowerCase().includes(q) && !t.from.toLowerCase().includes(q) && !t.businessName?.toLowerCase().includes(q)) return false;
      }
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      return true;
    });
  }, [tickets, search, filterStatus, filterPriority]);

  const counts = {
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
  };

  const updateStatus = (id: string, status: SupportTicket["status"]) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <AdminLayout
      activeView="admin-support"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Customer Support"
      subtitle={`${counts.open} open · ${counts.pending} pending · ${counts.urgent} urgent · ${counts.resolved} resolved`}
      actions={
        <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
          Back to dashboard
        </AdminButton>
      }
    >
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Open tickets" value={counts.open} icon={Inbox} accent={counts.open > 0} />
        <KpiCard label="Pending" value={counts.pending} icon={Clock} />
        <KpiCard label="Urgent" value={counts.urgent} icon={AlertCircle} delta={counts.urgent > 0 ? "Needs attention" : "None"} deltaPositive={counts.urgent === 0} />
        <KpiCard label="Resolved" value={counts.resolved} icon={CheckCircle2} />
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 px-3 flex-1 border rounded-[8px]" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" }}>
          <Search size={16} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full bg-transparent border-0 outline-none py-2.5"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-sm)" }}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-sm)", borderColor: "var(--color-border-strong)" }}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)} className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-sm)", borderColor: "var(--color-border-strong)" }}>
          <option value="all">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Ticket list */}
      <div className="space-y-2">
        {filtered.map((ticket, i) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.03 }}
            className="border rounded-[10px] p-4 hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: ticket.priority === "urgent" ? "var(--color-warning)" : "var(--color-border)",
              borderLeftWidth: ticket.priority === "urgent" ? 4 : 1,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="inline-block"
                    style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: PRIORITY_COLORS[ticket.priority] }}
                  />
                  <p
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-sm)" }}
                  >
                    {ticket.subject}
                  </p>
                  {ticket.priority === "urgent" && (
                    <span
                      className="px-1.5 py-0.5 rounded font-semibold"
                      style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)", fontSize: 10 }}
                    >
                      URGENT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-xs)" }}>
                    {ticket.from}
                  </span>
                  {ticket.businessName && (
                    <span style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-xs)" }}>
                      · {ticket.businessName}
                    </span>
                  )}
                  <span style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-xs)" }}>
                    · {CATEGORY_LABELS[ticket.category]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="inline-flex items-center gap-1"
                  style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-inter), sans-serif", fontSize: 11 }}
                >
                  <MessageSquare size={11} strokeWidth={2} />
                  {ticket.messageCount}
                </span>
                <StatusPill
                  status={ticket.status === "resolved" || ticket.status === "closed" ? "verified" : ticket.status === "pending" ? "pending" : "cancelled"}
                  label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]">
              <span style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-inter), sans-serif", fontSize: 11 }}>
                Created {ticket.createdAt} · Last reply {ticket.lastReply}
              </span>
              <div className="flex items-center gap-1">
                {ticket.status !== "resolved" && ticket.status !== "closed" && (
                  <>
                    <AdminButton variant="ghost" size="sm" onClick={() => updateStatus(ticket.id, "pending")}>
                      <Send size={12} strokeWidth={2.5} />
                      Reply
                    </AdminButton>
                    <AdminButton variant="secondary" size="sm" onClick={() => updateStatus(ticket.id, "resolved")}>
                      <CheckCircle2 size={12} strokeWidth={2.5} />
                      Resolve
                    </AdminButton>
                  </>
                )}
                {ticket.status === "resolved" && (
                  <AdminButton variant="ghost" size="sm" onClick={() => updateStatus(ticket.id, "closed")}>
                    Close
                  </AdminButton>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-3" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-xs)" }}>
        Showing {filtered.length} of {tickets.length} tickets
      </p>
    </AdminLayout>
  );
}
