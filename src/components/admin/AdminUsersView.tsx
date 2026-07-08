"use client";

import { useState, useMemo } from "react";
import { AdminLayout, StatusPill, AdminButton, AdminTable, KpiCard } from "./AdminLayout";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Search,
  MoreHorizontal,
  Trash2,
  Mail,
  Ban,
  Crown,
  UserCheck,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";
import { exportToCsv } from "@/lib/csv-export";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator" | "viewer";
  status: "active" | "suspended" | "invited";
  lastActive: string;
  joinedAt: string;
  permissions: string[];
}

const MOCK_USERS: AdminUser[] = [
  { id: "u1", name: "Arjun Mehta", email: "arjun@verifiedbusiness.in", role: "super_admin", status: "active", lastActive: "2 min ago", joinedAt: "2026-01-15", permissions: ["all"] },
  { id: "u2", name: "Priya Reddy", email: "priya@verifiedbusiness.in", role: "admin", status: "active", lastActive: "1 hour ago", joinedAt: "2026-02-01", permissions: ["businesses", "reviews", "subscriptions"] },
  { id: "u3", name: "Karthik Nair", email: "karthik@verifiedbusiness.in", role: "moderator", status: "active", lastActive: "3 hours ago", joinedAt: "2026-02-15", permissions: ["reviews"] },
  { id: "u4", name: "Sneha Patel", email: "sneha@verifiedbusiness.in", role: "admin", status: "active", lastActive: "5 hours ago", joinedAt: "2026-03-01", permissions: ["businesses", "subscriptions"] },
  { id: "u5", name: "Rohan Gupta", email: "rohan@verifiedbusiness.in", role: "viewer", status: "invited", lastActive: "Never", joinedAt: "2026-07-01", permissions: ["dashboard"] },
  { id: "u6", name: "Anita Singh", email: "anita@verifiedbusiness.in", role: "moderator", status: "suspended", lastActive: "2 days ago", joinedAt: "2026-04-10", permissions: ["reviews"] },
];

const ROLE_LABELS: Record<AdminUser["role"], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<AdminUser["role"], string> = {
  super_admin: "var(--color-accent)",
  admin: "var(--color-success)",
  moderator: "var(--color-warning)",
  viewer: "var(--color-text-tertiary)",
};

export function AdminUsersView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("User Management | Admin · VerifiedBusiness.in");

  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | AdminUser["role"]>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | AdminUser["status"]>("all");
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (filterRole !== "all" && u.role !== filterRole) return false;
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      return true;
    });
  }, [users, search, filterRole, filterStatus]);

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "super_admin" || u.role === "admin").length,
    moderators: users.filter((u) => u.role === "moderator").length,
  };

  const handleSuspend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "suspended" ? "active" : "suspended" }
          : u,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <AdminLayout
      activeView="admin-users"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="User Management"
      subtitle="Manage admin team members, roles, and permissions"
      actions={
        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => {
              exportToCsv(`admin-users-${Date.now()}.csv`, filtered, [
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
                { key: "status", label: "Status" },
                { key: "lastActive", label: "Last Active" },
                { key: "joinedAt", label: "Joined" },
              ]);
            }}
          >
            Export
          </AdminButton>
          <AdminButton variant="primary" size="sm" onClick={() => setInviteOpen(true)}>
            <Mail size={14} strokeWidth={2.5} />
            Invite User
          </AdminButton>
        </div>
      }
    >
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total users" value={counts.total} icon={Users} />
        <KpiCard label="Active" value={counts.active} icon={UserCheck} />
        <KpiCard label="Admins" value={counts.admins} icon={Shield} accent />
        <KpiCard label="Moderators" value={counts.moderators} icon={Crown} />
      </div>

      {/* Role legend */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <span
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Roles:
        </span>
        {(Object.entries(ROLE_LABELS) as [AdminUser["role"], string][]).map(([role, label]) => (
          <span
            key={role}
            className="inline-flex items-center gap-1.5"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            <span
              className="inline-block"
              style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: ROLE_COLORS[role] }}
            />
            {label}
          </span>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 flex-1 border rounded-[8px]"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" }}
        >
          <Search size={16} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-0 outline-none py-2.5"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
          className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <option value="all">All roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="viewer">Viewer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="invited">Invited</option>
        </select>
      </div>

      {/* Users table */}
      <AdminTable headers={["User", "Role", "Status", "Last Active", "Joined", "Actions"]}>
        {filtered.map((user) => (
          <tr
            key={user.id}
            className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="inline-flex items-center justify-center shrink-0 font-display font-semibold"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    backgroundColor: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {user.name}
                    {user.role === "super_admin" && (
                      <Crown
                        size={12}
                        strokeWidth={2.5}
                        className="inline ml-1.5"
                        style={{ color: "var(--color-warning)", verticalAlign: "middle" }}
                      />
                    )}
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <span
                className="inline-flex items-center gap-1.5 font-medium"
                style={{
                  color: ROLE_COLORS[user.role],
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                <span
                  className="inline-block"
                  style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: ROLE_COLORS[user.role] }}
                />
                {ROLE_LABELS[user.role]}
              </span>
            </td>
            <td className="px-4 py-3">
              <StatusPill
                status={user.status === "active" ? "verified" : user.status === "suspended" ? "cancelled" : "pending"}
                label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              />
            </td>
            <td className="px-4 py-3">
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                {user.lastActive}
              </span>
            </td>
            <td className="px-4 py-3">
              <span
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                {user.joinedAt}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSuspend(user.id)}
                  aria-label={user.status === "suspended" ? "Reactivate" : "Suspend"}
                  title={user.status === "suspended" ? "Reactivate" : "Suspend"}
                  className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--radius-sm)",
                    color: user.status === "suspended" ? "var(--color-success)" : "var(--color-warning)",
                  }}
                >
                  <Ban size={14} strokeWidth={2.2} />
                </button>
                {user.role !== "super_admin" && (
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    aria-label="Delete user"
                    title="Delete"
                    className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "var(--radius-sm)",
                      color: "var(--color-warning)",
                    }}
                  >
                    <Trash2 size={14} strokeWidth={2.2} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <p
        className="mt-3"
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-xs)",
        }}
      >
        Showing {filtered.length} of {users.length} users · Super Admins cannot be deleted
      </p>

      {/* Invite modal */}
      {inviteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setInviteOpen(false)}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(26, 25, 23, 0.5)", backdropFilter: "blur(4px)" }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-md border rounded-[16px] glass-strong p-6"
            style={{ borderColor: "var(--color-border)", boxShadow: "var(--shadow-lg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-display font-bold mb-4"
              style={{ fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}
            >
              Invite team member
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block mb-1.5 font-medium"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-xs)" }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="colleague@verifiedbusiness.in"
                  className="w-full px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-sm)", borderColor: "var(--color-border-strong)" }}
                />
              </div>
              <div>
                <label
                  className="block mb-1.5 font-medium"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-xs)" }}
                >
                  Role
                </label>
                <select
                  className="w-full px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "var(--text-sm)", borderColor: "var(--color-border-strong)" }}
                >
                  <option value="admin">Admin — full access except user management</option>
                  <option value="moderator">Moderator — review moderation only</option>
                  <option value="viewer">Viewer — read-only dashboard access</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <AdminButton variant="secondary" size="sm" onClick={() => setInviteOpen(false)}>Cancel</AdminButton>
              <AdminButton variant="primary" size="sm" onClick={() => setInviteOpen(false)}>
                <Mail size={14} strokeWidth={2.5} />
                Send invite
              </AdminButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
}
