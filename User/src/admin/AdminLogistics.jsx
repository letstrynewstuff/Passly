// src/admin/AdminLogistics.jsx
import React, { useEffect, useState } from "react";
import {
  Car,
  Phone,
  MapPin,
  User,
  RefreshCw,
  CheckCircle,
  Save,
} from "lucide-react";
import { fmt, fmtDate, SectionHeader, LoadingSpinner } from "./adminUtils";

// Logistics tier display config
const TIER_CONFIG = {
  sedan: {
    label: "Sedan",
    icon: "🚗",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  suv: {
    label: "SUV",
    icon: "🚙",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  party_bus: {
    label: "Party Bus",
    icon: "🚌",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
};

// Inline edit form for admin to fill pickup details
const PickupForm = ({ ticket, api, onSaved }) => {
  const [form, setForm] = useState({
    contactName: ticket.logistics?.contactName || "",
    contactPhone: ticket.logistics?.contactPhone || "",
    pickupAddress: ticket.logistics?.pickupAddress || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/logistics/${ticket._id}`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSaved(ticket._id, form);
    } catch (err) {
      console.error("Save logistics details error:", err);
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full bg-[#1f2937] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors";
  const label = "block text-xs text-gray-500 mb-1.5";

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Pickup Details
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label}>
            <User className="w-3 h-3 inline mr-1" />
            Passenger Name
          </label>
          <input
            value={form.contactName}
            onChange={(e) =>
              setForm((p) => ({ ...p, contactName: e.target.value }))
            }
            className={input}
            placeholder="Full name of passenger"
          />
        </div>
        <div>
          <label className={label}>
            <Phone className="w-3 h-3 inline mr-1" />
            Phone Number
          </label>
          <input
            value={form.contactPhone}
            onChange={(e) =>
              setForm((p) => ({ ...p, contactPhone: e.target.value }))
            }
            className={input}
            placeholder="08XXXXXXXXX"
          />
        </div>
      </div>
      <div>
        <label className={label}>
          <MapPin className="w-3 h-3 inline mr-1" />
          Pickup Address
        </label>
        <input
          value={form.pickupAddress}
          onChange={(e) =>
            setForm((p) => ({ ...p, pickupAddress: e.target.value }))
          }
          className={input}
          placeholder="Full pickup address"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
          saved
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
        } disabled:opacity-40`}
      >
        {saving ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : saved ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <Save className="w-3 h-3" />
        )}
        {saved ? "Saved!" : saving ? "Saving…" : "Save Details"}
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminLogistics = ({ api, refreshKey }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | sedan | suv | party_bus
  const [expanded, setExpanded] = useState(null); // ticket _id currently showing form

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/logistics")
      .then((r) => {
        if (r.data.success) setTickets(r.data.tickets);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleSaved = (ticketId, form) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === ticketId
          ? { ...t, logistics: { ...t.logistics, ...form } }
          : t,
      ),
    );
  };

  const filtered = tickets.filter(
    (t) => filter === "all" || t.logistics?.tier === filter,
  );

  // Total logistics revenue
  const totalLogisticsRevenue = tickets.reduce(
    (s, t) => s + (t.logistics?.price || 0),
    0,
  );

  const tierCounts = {
    sedan: tickets.filter((t) => t.logistics?.tier === "sedan").length,
    suv: tickets.filter((t) => t.logistics?.tier === "suv").length,
    party_bus: tickets.filter((t) => t.logistics?.tier === "party_bus").length,
  };

  return (
    <div>
      <SectionHeader
        title="Logistics Management"
        subtitle="Users who booked transport service"
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Orders</p>
          <p className="text-xl font-bold text-white">{tickets.length}</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Logistics Revenue</p>
          {/* ✅ Logistics amount only — ticket price excluded */}
          <p className="text-xl font-bold text-violet-400">
            {fmt(totalLogisticsRevenue)}
          </p>
        </div>
        {Object.entries(tierCounts).map(([tier, count]) => {
          const cfg = TIER_CONFIG[tier];
          return (
            <div
              key={tier}
              className={`${cfg.bg} border border-white/5 rounded-xl p-4 text-center`}
            >
              <p className="text-xs text-gray-500 mb-1">
                {cfg.icon} {cfg.label}
              </p>
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Tier filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "sedan", "suv", "party_bus"].map((tier) => {
          const cfg = tier === "all" ? null : TIER_CONFIG[tier];
          return (
            <button
              key={tier}
              onClick={() => setFilter(tier)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tier
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-white/5 text-gray-500 hover:text-gray-300"
              }`}
            >
              {cfg ? `${cfg.icon} ${cfg.label}` : "All"}
              <span className="ml-1.5 text-gray-600">
                ({tier === "all" ? tickets.length : tierCounts[tier]})
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No logistics orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const tier = ticket.logistics?.tier;
            const cfg = TIER_CONFIG[tier] || TIER_CONFIG.sedan;
            const isOpen = expanded === ticket._id;
            const hasDetails =
              ticket.logistics?.contactName ||
              ticket.logistics?.contactPhone ||
              ticket.logistics?.pickupAddress;

            return (
              <div
                key={ticket._id}
                className="bg-[#111827] border border-white/5 rounded-2xl p-5"
              >
                {/* Header row */}
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Tier badge */}
                  <div
                    className={`${cfg.bg} rounded-xl px-3 py-2 flex items-center gap-2 flex-shrink-0`}
                  >
                    <span className="text-lg">{cfg.icon}</span>
                    <span className={`text-sm font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {ticket.userId?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ticket.userId?.email}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Event: {ticket.eventId?.title || "—"} ·{" "}
                      {fmtDate(ticket.purchaseDate)}
                    </p>
                  </div>

                  {/* Logistics price — ticket price NOT shown */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">
                      {fmt(ticket.logistics?.price)}
                    </p>
                    <p className="text-xs text-gray-500">logistics only</p>
                  </div>
                </div>

                {/* Filled pickup details (preview) */}
                {hasDetails && !isOpen && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {ticket.logistics.contactName && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <User className="w-3 h-3 text-gray-600" />
                        {ticket.logistics.contactName}
                      </div>
                    )}
                    {ticket.logistics.contactPhone && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Phone className="w-3 h-3 text-gray-600" />
                        {ticket.logistics.contactPhone}
                      </div>
                    )}
                    {ticket.logistics.pickupAddress && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3 h-3 text-gray-600" />
                        {ticket.logistics.pickupAddress}
                      </div>
                    )}
                  </div>
                )}

                {/* Toggle form button */}
                <button
                  onClick={() => setExpanded(isOpen ? null : ticket._id)}
                  className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition"
                >
                  {isOpen
                    ? "Hide form ↑"
                    : hasDetails
                      ? "Edit pickup details ↓"
                      : "Add pickup details ↓"}
                </button>

                {/* Pickup form */}
                {isOpen && (
                  <PickupForm ticket={ticket} api={api} onSaved={handleSaved} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminLogistics;
