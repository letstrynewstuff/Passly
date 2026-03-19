// src/admin/adminUtils.jsx
import React from "react";
import { RefreshCw } from "lucide-react";

// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmt = (v) => `₦${Number(v || 0).toLocaleString()}`;

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Status config ────────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  pending: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    dot: "bg-yellow-400",
    label: "Pending",
  },
  approved: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
    label: "Approved",
  },
  rejected: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
    label: "Rejected",
  },
  paid: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
    label: "Paid",
  },
  deleted: {
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    dot: "bg-gray-500",
    label: "Deleted",
  },
};

// ─── Reusable components ──────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

export const ActionBtn = ({
  onClick,
  icon,
  label,
  variant = "default",
  loading,
}) => {
  const Icon = icon;
  const styles = {
    default: "bg-white/5 hover:bg-white/10 text-gray-300",
    success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400",
    warning: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400",
    blue: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400",
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={label}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${styles[variant]}`}
    >
      {loading ? (
        <RefreshCw className="w-3 h-3 animate-spin" />
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {label}
    </button>
  );
};

export const LoadingSpinner = () => (
  <div className="flex justify-center py-16">
    <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
  </div>
);
