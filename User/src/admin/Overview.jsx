// src/admin/Overview.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Ticket,
  Wallet,
  Calendar,
  CheckCircle,
  Users,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { fmt, fmtDate, StatusBadge, SectionHeader } from "./adminUtils";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, accent, delay = 0 }) => {
  const Icon = icon;
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="p-2 rounded-xl" style={{ background: `${accent}18` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight break-all">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </Motion.div>
  );
};

// ─── Overview ─────────────────────────────────────────────────────────────────
const Overview = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Row 1 — financial stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Gross Revenue"
          value={fmt(stats.totalRevenue)}
          sub="all approved events"
          accent="#a78bfa"
          delay={0}
        />
        <StatCard
          icon={TrendingUp}
          label="Platform Commission"
          value={fmt(stats.platformCommission)}
          sub="10% of gross"
          accent="#f472b6"
          delay={0.05}
        />
        <StatCard
          icon={Ticket}
          label="Tickets Sold"
          value={stats.totalTicketsSold?.toLocaleString()}
          sub="approved events"
          accent="#34d399"
          delay={0.1}
        />
        <StatCard
          icon={Wallet}
          label="Total Paid Out"
          value={fmt(stats.totalPaidOut)}
          sub="completed withdrawals"
          accent="#60a5fa"
          delay={0.15}
        />
      </div>

      {/* Row 2 — platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Events"
          value={stats.totalEvents}
          sub={`${stats.pendingEvents} pending`}
          accent="#fb923c"
          delay={0.2}
        />
        <StatCard
          icon={CheckCircle}
          label="Approved Events"
          value={stats.approvedEvents}
          sub="live on platform"
          accent="#34d399"
          delay={0.25}
        />
        <StatCard
          icon={Users}
          label="Planners"
          value={stats.totalPlanners}
          sub="registered"
          accent="#a78bfa"
          delay={0.3}
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          sub="awaiting action"
          accent="#facc15"
          delay={0.35}
        />
      </div>

      {/* Revenue chart */}
      {stats.topEvents?.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#111827] border border-white/5 rounded-2xl p-6"
        >
          <SectionHeader
            title="Top Events by Revenue"
            subtitle="Approved events only"
          />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.topEvents} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="title" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#1f2937",
                  border: "none",
                  borderRadius: 12,
                  color: "#f9fafb",
                }}
                formatter={(v) => [fmt(v), "Revenue"]}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {stats.topEvents.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      ["#a78bfa", "#f472b6", "#34d399", "#60a5fa", "#fb923c"][
                        i % 5
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Motion.div>
      )}

      {/* Recent events + recent withdrawals */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent events */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-[#111827] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <SectionHeader title="Recent Events" />
            <button
              onClick={() => onNavigate("events")}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentEvents?.length === 0 && (
              <p className="text-gray-600 text-sm">No events yet</p>
            )}
            {stats.recentEvents?.map((event) => (
              <div
                key={event._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                {event.media ? (
                  <img
                    src={event.media}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.planner?.username || "Unknown"} ·{" "}
                    {fmtDate(event.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusBadge status={event.status} />
                  <span className="text-xs text-gray-500">
                    {event.ticketsSold} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Motion.div>

        {/* Recent withdrawals */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#111827] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <SectionHeader title="Recent Withdrawals" />
            <button
              onClick={() => onNavigate("withdrawals")}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentWithdrawals?.length === 0 && (
              <p className="text-gray-600 text-sm">
                No withdrawal requests yet
              </p>
            )}
            {stats.recentWithdrawals?.map((w) => (
              <div
                key={w._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {w.plannerId?.companyName ||
                      w.plannerId?.username ||
                      "Planner"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fmtDate(w.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-bold text-white">
                    {fmt(w.amount)}
                  </span>
                  <StatusBadge status={w.status} />
                </div>
              </div>
            ))}
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default Overview;
