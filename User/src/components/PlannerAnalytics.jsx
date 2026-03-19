// src/components/PlannerAnalytics.jsx
import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Award,
  AlertCircle,
  ChevronDown,
  Calendar,
} from "lucide-react";

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];
const formatNaira = (v) => `₦${Number(v).toLocaleString()}`;

// const StatCard = ({ icon: Icon, label, value, sub, color, isDark, delay }) => (
//   <Motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay }}
//     className={`rounded-2xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg flex items-start gap-4`}
//   >
//     <div className="p-3 rounded-xl" style={{ background: `${color}22` }}>
//       <Icon className="w-6 h-6" style={{ color }} />
//     </div>
//     <div>
//       <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//         {label}
//       </p>
//       <p
//         className={`text-2xl font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
//       >
//         {value}
//       </p>
//       {sub && (
//         <p
//           className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
//         >
//           {sub}
//         </p>
//       )}
//     </div>
//   </Motion.div>
// );
const StatCard = ({ icon: Icon, label, value, sub, color, isDark, delay }) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`rounded-2xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg flex items-start gap-4`}
  >
    <div className={`p-3 rounded-xl`} style={{ background: `${color}22` }}>
      {Icon && <Icon className="w-6 h-6" style={{ color }} />}
    </div>
    <div>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      <p
        className={`text-2xl font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  </Motion.div>
);
const PlannerAnalytics = ({ events, isDark }) => {
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [analytics, setAnalytics] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/tickets/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setAnalytics(data.analytics);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };
    fetchAnalytics();
  }, []);

  const selectedEvent =
    selectedEventId === "all"
      ? null
      : events.find((e) => e._id === selectedEventId);

  const activeEvents = selectedEvent ? [selectedEvent] : events;

  // Compute performance stats
  const eventPerformance = activeEvents.map((event) => {
    const totalAvailable = (event.ticketCategories || []).reduce(
      (sum, cat) => sum + (cat.quantityAvailable || 0),
      0,
    );
    const totalSold = (event.ticketCategories || []).reduce(
      (sum, cat) => sum + (cat.quantitySold || 0),
      0,
    );
    const revenue = (event.ticketCategories || []).reduce(
      (sum, cat) => sum + (cat.price || 0) * (cat.quantitySold || 0),
      0,
    );
    return {
      _id: event._id,
      title:
        event.title?.length > 16 ? event.title.slice(0, 16) + "…" : event.title,
      fullTitle: event.title,
      media: event.media?.[0],
      date: event.date,
      ticketCategories: event.ticketCategories || [],
      sold: totalSold,
      available: totalAvailable,
      remaining: totalAvailable - totalSold,
      revenue,
      attendanceRate:
        totalAvailable > 0 ? Math.round((totalSold / totalAvailable) * 100) : 0,
    };
  });

  // Ticket type breakdown scoped to selected event
  const ticketTypeMap = {};
  activeEvents.forEach((event) => {
    (event.ticketCategories || []).forEach((cat) => {
      const key = selectedEvent ? cat.name : `${event.title} — ${cat.name}`;
      if (!ticketTypeMap[key])
        ticketTypeMap[key] = {
          name: cat.name,
          label: key,
          sold: 0,
          revenue: 0,
        };
      ticketTypeMap[key].sold += cat.quantitySold || 0;
      ticketTypeMap[key].revenue += (cat.price || 0) * (cat.quantitySold || 0);
    });
  });
  const ticketTypeData = Object.values(ticketTypeMap);

  const totalRevenue = eventPerformance.reduce((sum, e) => sum + e.revenue, 0);
  const totalSold = eventPerformance.reduce((sum, e) => sum + e.sold, 0);
  const totalAvailable = eventPerformance.reduce(
    (sum, e) => sum + e.available,
    0,
  );
  const avgAttendance =
    eventPerformance.length > 0
      ? Math.round(
          eventPerformance.reduce((sum, e) => sum + e.attendanceRate, 0) /
            eventPerformance.length,
        )
      : 0;
  const topEvent = [...eventPerformance].sort(
    (a, b) => b.revenue - a.revenue,
  )[0];

  const dailySales =
    selectedEventId === "all"
      ? analytics?.dailySales || []
      : analytics?.dailySalesByEvent?.[selectedEventId] || [];

  const tooltipStyle = {
    backgroundColor: isDark ? "#1f2937" : "#fff",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    color: isDark ? "#f9fafb" : "#111827",
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header + Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Analytics & Insights
          </h2>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {selectedEvent
              ? `Viewing: ${selectedEvent.title}`
              : `Overview across ${events.length} events`}
          </p>
        </div>

        {/* Event Dropdown */}
        <div className="relative z-30">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-[220px] shadow-sm ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white hover:border-purple-500"
                : "bg-white border-gray-200 text-gray-900 hover:border-purple-400"
            }`}
          >
            {selectedEvent?.media ? (
              <img
                src={selectedEvent.media}
                className="w-6 h-6 rounded object-cover flex-shrink-0"
              />
            ) : (
              <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0" />
            )}
            <span className="flex-1 text-left text-sm font-medium truncate">
              {selectedEvent ? selectedEvent.title : "All Events"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform text-gray-400 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <Motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl border overflow-hidden ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                {/* All Events */}
                <button
                  onClick={() => {
                    setSelectedEventId("all");
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                    selectedEventId === "all"
                      ? "bg-purple-500/10 text-purple-500"
                      : isDark
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">All Events</p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Combined overview
                    </p>
                  </div>
                  {selectedEventId === "all" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </button>

                <div
                  className={`border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}
                />

                <div className="max-h-64 overflow-y-auto">
                  {events.map((event) => {
                    const sold = (event.ticketCategories || []).reduce(
                      (s, c) => s + (c.quantitySold || 0),
                      0,
                    );
                    const available = (event.ticketCategories || []).reduce(
                      (s, c) => s + (c.quantityAvailable || 0),
                      0,
                    );
                    return (
                      <button
                        key={event._id}
                        onClick={() => {
                          setSelectedEventId(event._id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                          selectedEventId === event._id
                            ? "bg-purple-500/10"
                            : isDark
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={
                            event.media?.[0] || "https://via.placeholder.com/32"
                          }
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              selectedEventId === event._id
                                ? "text-purple-500"
                                : isDark
                                  ? "text-white"
                                  : "text-gray-900"
                            }`}
                          >
                            {event.title}
                          </p>
                          <p
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {sold}/{available} sold ·{" "}
                            {(event.ticketCategories || []).length} categories
                          </p>
                        </div>
                        {selectedEventId === event._id && (
                          <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setDropdownOpen(false)}
        />
      )}

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatNaira(totalRevenue)}
          sub={selectedEvent ? "this event" : `${events.length} events`}
          color="#a855f7"
          isDark={isDark}
          delay={0}
        />
        <StatCard
          icon={Ticket}
          label="Tickets Sold"
          value={totalSold.toLocaleString()}
          sub={`of ${totalAvailable.toLocaleString()} available`}
          color="#ec4899"
          isDark={isDark}
          delay={0.05}
        />
        <StatCard
          icon={Users}
          label="Avg Fill Rate"
          value={`${avgAttendance}%`}
          sub="capacity filled"
          color="#3b82f6"
          isDark={isDark}
          delay={0.1}
        />
        <StatCard
          icon={Award}
          label={selectedEvent ? "Categories" : "Top Event"}
          value={
            selectedEvent
              ? `${(selectedEvent.ticketCategories || []).length} types`
              : topEvent?.title || "—"
          }
          sub={selectedEvent ? "ticket types" : "by revenue"}
          color="#10b981"
          isDark={isDark}
          delay={0.15}
        />
      </div> */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <StatCard
          // icon={DollarSign}
          label="Total Revenue"
          value={formatNaira(totalRevenue)}
          sub={selectedEvent ? "this event" : `${events.length} events`}
          color="#a855f7"
          isDark={isDark}
          delay={0}
        />
        <StatCard
          icon={Ticket}
          label="Tickets Sold"
          value={totalSold.toLocaleString()}
          sub={`of ${totalAvailable.toLocaleString()} available`}
          color="#ec4899"
          isDark={isDark}
          delay={0.05}
        />
        <StatCard
          icon={Users}
          label="Avg Fill Rate"
          value={`${avgAttendance}%`}
          sub="capacity filled"
          color="#3b82f6"
          isDark={isDark}
          delay={0.1}
        />
        <StatCard
          icon={Award}
          label={selectedEvent ? "Categories" : "Top Event"}
          value={
            selectedEvent
              ? `${(selectedEvent.ticketCategories || []).length} types`
              : topEvent?.title || "—"
          }
          sub={selectedEvent ? "ticket types" : "by revenue"}
          color="#10b981"
          isDark={isDark}
          delay={0.15}
        />
      </div>

      {/* Revenue over time */}

      {dailySales.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <h3
            className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Revenue Over Time (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailySales}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [formatNaira(v), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Motion.div>
      )}

      {/* All Events — comparison bar chart + event cards */}
      {selectedEventId === "all" && eventPerformance.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <h3
            className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Event Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventPerformance}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [
                  name === "revenue" ? formatNaira(v) : v,
                  name === "revenue"
                    ? "Revenue"
                    : name === "sold"
                      ? "Sold"
                      : "Remaining",
                ]}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#a855f7"
                radius={[6, 6, 0, 0]}
                name="revenue"
              />
              <Bar
                dataKey="sold"
                fill="#ec4899"
                radius={[6, 6, 0, 0]}
                name="sold"
              />
              <Bar
                dataKey="remaining"
                fill={isDark ? "#374151" : "#e5e7eb"}
                radius={[6, 6, 0, 0]}
                name="remaining"
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {eventPerformance.map((event, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEventId(event._id)}
                className={`w-full p-4 rounded-xl text-left transition-all hover:ring-2 hover:ring-purple-400 flex items-center gap-4 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {event.media && (
                  <img
                    src={event.media}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {event.fullTitle}
                  </p>
                  <p
                    className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {event.sold}/{event.available} sold ·{" "}
                    {formatNaira(event.revenue)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-sm font-bold ${
                      event.attendanceRate >= 75
                        ? "text-green-500"
                        : event.attendanceRate >= 40
                          ? "text-yellow-500"
                          : "text-red-400"
                    }`}
                  >
                    {event.attendanceRate}%
                  </span>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${event.attendanceRate}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    tap for details
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Motion.div>
      )}

      {/* Single Event Detail */}
      {selectedEvent && (
        <Motion.div
          key={selectedEvent._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <div className="flex items-center gap-4 mb-6">
            {selectedEvent.media?.[0] && (
              <img
                src={selectedEvent.media[0]}
                className="w-14 h-14 rounded-xl object-cover"
              />
            )}
            <div>
              <h3
                className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {selectedEvent.title}
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {selectedEvent.date
                  ? new Date(selectedEvent.date).toLocaleDateString("en-NG", {
                      dateStyle: "long",
                    })
                  : "Date TBA"}
              </p>
            </div>
          </div>

          <h4
            className={`font-semibold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Ticket Categories Breakdown
          </h4>
          <div className="space-y-3 mb-6">
            {(selectedEvent.ticketCategories || []).map((cat, idx) => {
              const fillRate =
                cat.quantityAvailable > 0
                  ? Math.round(
                      ((cat.quantitySold || 0) / cat.quantityAvailable) * 100,
                    )
                  : 0;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: COLORS[idx % COLORS.length] }}
                      />
                      <span
                        className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-purple-500 font-bold">
                      {formatNaira(cat.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
                      {cat.quantitySold || 0} sold /{" "}
                      {cat.quantityAvailable || 0} available
                    </span>
                    <span
                      className={`font-medium ${
                        fillRate >= 75
                          ? "text-green-500"
                          : fillRate >= 40
                            ? "text-yellow-500"
                            : "text-red-400"
                      }`}
                    >
                      {fillRate}% sold
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${fillRate}%`,
                        background: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Revenue:{" "}
                    {formatNaira((cat.price || 0) * (cat.quantitySold || 0))}
                    {" · "}
                    {cat.quantityAvailable - (cat.quantitySold || 0)} remaining
                  </p>
                </div>
              );
            })}
          </div>

          {ticketTypeData.length > 1 && (
            <>
              <h4
                className={`font-semibold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Sales Split by Ticket Type
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ticketTypeData}
                    dataKey="sold"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {ticketTypeData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => [v, "Sold"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </Motion.div>
      )}

      {/* All Events — ticket type revenue bars */}
      {selectedEventId === "all" && ticketTypeData.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <h3
            className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Revenue by Ticket Category (All Events)
          </h3>
          <div className="space-y-3">
            {ticketTypeData
              .sort((a, b) => b.revenue - a.revenue)
              .map((type, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span
                        className={`text-sm font-medium truncate max-w-[60%] ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {type.label}
                      </span>
                      <span
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {formatNaira(type.revenue)} · {type.sold} sold
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${ticketTypeData[0]?.revenue > 0 ? (type.revenue / ticketTypeData[0].revenue) * 100 : 0}%`,
                          background: COLORS[idx % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Motion.div>
      )}

      {/* QR Attendance placeholder */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg border-2 border-dashed ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <h3
            className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            QR Scan Attendance Analytics
          </h3>
        </div>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Once you implement QR code scanning at your events, this section will
          show check-in rates, peak arrival times, and no-show statistics.
        </p>
      </Motion.div>
    </Motion.div>
  );
};

export default PlannerAnalytics;

// // src/components/PlannerAnalytics.jsx
// import React, { useState, useEffect } from "react";
// import { motion as Motion } from "framer-motion";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   TrendingUp,
//   DollarSign,
//   Ticket,
//   Users,
//   Award,
//   AlertCircle,
// } from "lucide-react";

// const COLORS = [
//   "#a855f7",
//   "#ec4899",
//   "#3b82f6",
//   "#10b981",
//   "#f59e0b",
//   "#ef4444",
// ];

// const formatNaira = (value) => `₦${Number(value).toLocaleString()}`;

// // const StatCard = ({ icon, label, value, sub, color, isDark, delay }) => (
// //   <Motion.div
// //     initial={{ opacity: 0, y: 20 }}
// //     animate={{ opacity: 1, y: 0 }}
// //     transition={{ delay }}
// //     className={`rounded-2xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg flex items-start gap-4`}
// //   >
// //     <div className={`p-3 rounded-xl`} style={{ background: `${color}22` }}>
// //       {icon({ className: "w-6 h-6", style: { color } })}
// //     </div>
// //     <div>
// //       <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
// //         {label}
// //       </p>
// //       <p
// //         className={`text-2xl font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
// //       >
// //         {value}
// //       </p>
// //       {sub && (
// //         <p
// //           className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
// //         >
// //           {sub}
// //         </p>
// //       )}
// //     </div>
// //   </Motion.div>
// // );
// const StatCard = ({ icon: Icon, label, value, sub, color, isDark, delay }) => (
//   <Motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay }}
//     className={`rounded-2xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg flex items-start gap-4`}
//   >
//     <div className={`p-3 rounded-xl`} style={{ background: `${color}22` }}>
//       {Icon && <Icon className="w-6 h-6" style={{ color }} />}
//     </div>
//     <div>
//       <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//         {label}
//       </p>
//       <p
//         className={`text-2xl font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
//       >
//         {value}
//       </p>
//       {sub && (
//         <p
//           className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
//         >
//           {sub}
//         </p>
//       )}
//     </div>
//   </Motion.div>
// );
// const PlannerAnalytics = ({ events, isDark }) => {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("http://localhost:5000/api/tickets/analytics", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.success) setAnalytics(data.analytics);
//       } catch (err) {
//         console.error("Analytics fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAnalytics();
//   }, []);

//   // Build event performance from events prop (no extra endpoint needed)
//   const eventPerformance = events.map((event) => {
//     const totalAvailable = (event.ticketCategories || []).reduce(
//       (sum, cat) => sum + (cat.quantityAvailable || 0),
//       0,
//     );
//     const totalSold = (event.ticketCategories || []).reduce(
//       (sum, cat) => sum + (cat.quantitySold || 0),
//       0,
//     );
//     const revenue = (event.ticketCategories || []).reduce(
//       (sum, cat) => sum + (cat.price || 0) * (cat.quantitySold || 0),
//       0,
//     );
//     const attendanceRate =
//       totalAvailable > 0 ? Math.round((totalSold / totalAvailable) * 100) : 0;
//     return {
//       title:
//         event.title?.length > 16 ? event.title.slice(0, 16) + "…" : event.title,
//       fullTitle: event.title,
//       sold: totalSold,
//       available: totalAvailable,
//       remaining: totalAvailable - totalSold,
//       revenue,
//       attendanceRate,
//     };
//   });

//   // Ticket type breakdown across all events
//   const ticketTypeMap = {};
//   events.forEach((event) => {
//     (event.ticketCategories || []).forEach((cat) => {
//       if (!ticketTypeMap[cat.name])
//         ticketTypeMap[cat.name] = { name: cat.name, sold: 0, revenue: 0 };
//       ticketTypeMap[cat.name].sold += cat.quantitySold || 0;
//       ticketTypeMap[cat.name].revenue +=
//         (cat.price || 0) * (cat.quantitySold || 0);
//     });
//   });
//   const ticketTypeData = Object.values(ticketTypeMap);

//   const totalRevenue =
//     analytics?.totalRevenue ||
//     eventPerformance.reduce((sum, e) => sum + e.revenue, 0);
//   const totalSold =
//     analytics?.totalTicketsSold ||
//     eventPerformance.reduce((sum, e) => sum + e.sold, 0);
//   const totalAvailable = eventPerformance.reduce(
//     (sum, e) => sum + e.available,
//     0,
//   );
//   const avgAttendance =
//     eventPerformance.length > 0
//       ? Math.round(
//           eventPerformance.reduce((sum, e) => sum + e.attendanceRate, 0) /
//             eventPerformance.length,
//         )
//       : 0;

//   const tooltipStyle = {
//     backgroundColor: isDark ? "#1f2937" : "#fff",
//     border: "none",
//     borderRadius: "12px",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//     color: isDark ? "#f9fafb" : "#111827",
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <Motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8"
//     >
//       {/* Header */}
//       <div>
//         <h2
//           className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
//         >
//           Analytics & Insights
//         </h2>
//         <p
//           className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
//         >
//           Performance overview across all your events
//         </p>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           icon={DollarSign}
//           label="Total Revenue"
//           value={formatNaira(totalRevenue)}
//           sub={`${events.length} events`}
//           color="#a855f7"
//           isDark={isDark}
//           delay={0}
//         />
//         <StatCard
//           icon={Ticket}
//           label="Tickets Sold"
//           value={totalSold.toLocaleString()}
//           sub={`of ${totalAvailable.toLocaleString()} available`}
//           color="#ec4899"
//           isDark={isDark}
//           delay={0.05}
//         />
//         <StatCard
//           icon={Users}
//           label="Avg Attendance"
//           value={`${avgAttendance}%`}
//           sub="across all events"
//           color="#3b82f6"
//           isDark={isDark}
//           delay={0.1}
//         />
//         <StatCard
//           icon={Award}
//           label="Top Event"
//           value={
//             eventPerformance.sort((a, b) => b.revenue - a.revenue)[0]?.title ||
//             "—"
//           }
//           sub="by revenue"
//           color="#10b981"
//           isDark={isDark}
//           delay={0.15}
//         />
//       </div>

//       {/* Revenue over time */}
//       {analytics?.dailySales?.length > 0 && (
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
//         >
//           <h3
//             className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
//           >
//             Revenue Over Time (Last 30 Days)
//           </h3>
//           <ResponsiveContainer width="100%" height={220}>
//             <AreaChart data={analytics.dailySales}>
//               <defs>
//                 <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke={isDark ? "#374151" : "#f3f4f6"}
//               />
//               <XAxis
//                 dataKey="date"
//                 tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
//                 tickFormatter={(d) => d.slice(5)}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
//                 tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
//               />
//               <Tooltip
//                 contentStyle={tooltipStyle}
//                 formatter={(v) => [formatNaira(v), "Revenue"]}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#a855f7"
//                 strokeWidth={2}
//                 fill="url(#revenueGrad)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </Motion.div>
//       )}

//       {/* Event Performance */}
//       {eventPerformance.length > 0 && (
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.25 }}
//           className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
//         >
//           <h3
//             className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
//           >
//             Event Performance
//           </h3>
//           <ResponsiveContainer width="100%" height={220}>
//             <BarChart data={eventPerformance}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke={isDark ? "#374151" : "#f3f4f6"}
//               />
//               <XAxis
//                 dataKey="title"
//                 tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
//                 tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
//               />
//               <Tooltip
//                 contentStyle={tooltipStyle}
//                 formatter={(v, name) => [
//                   name === "revenue" ? formatNaira(v) : v,
//                   name === "revenue"
//                     ? "Revenue"
//                     : name === "sold"
//                       ? "Sold"
//                       : "Remaining",
//                 ]}
//               />
//               <Legend />
//               <Bar
//                 dataKey="revenue"
//                 fill="#a855f7"
//                 radius={[6, 6, 0, 0]}
//                 name="revenue"
//               />
//               <Bar
//                 dataKey="sold"
//                 fill="#ec4899"
//                 radius={[6, 6, 0, 0]}
//                 name="sold"
//               />
//               <Bar
//                 dataKey="remaining"
//                 fill="#e5e7eb"
//                 radius={[6, 6, 0, 0]}
//                 name="remaining"
//               />
//             </BarChart>
//           </ResponsiveContainer>

//           {/* Event cards */}
//           <div className="mt-6 space-y-3">
//             {eventPerformance.map((event, idx) => (
//               <div
//                 key={idx}
//                 className={`p-4 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-50"} flex items-center gap-4`}
//               >
//                 <div className="flex-1">
//                   <p
//                     className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
//                   >
//                     {event.fullTitle}
//                   </p>
//                   <p
//                     className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
//                   >
//                     {event.sold} / {event.available} tickets sold ·{" "}
//                     {formatNaira(event.revenue)}
//                   </p>
//                 </div>
//                 <div className="flex flex-col items-end gap-1">
//                   <span
//                     className={`text-sm font-bold ${
//                       event.attendanceRate >= 75
//                         ? "text-green-500"
//                         : event.attendanceRate >= 40
//                           ? "text-yellow-500"
//                           : "text-red-400"
//                     }`}
//                   >
//                     {event.attendanceRate}%
//                   </span>
//                   <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
//                       style={{ width: `${event.attendanceRate}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Motion.div>
//       )}

//       {/* Ticket Type Breakdown */}
//       {ticketTypeData.length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
//           >
//             <h3
//               className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
//             >
//               Ticket Types — Sales Split
//             </h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={ticketTypeData}
//                   dataKey="sold"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   innerRadius={50}
//                   paddingAngle={3}
//                 >
//                   {ticketTypeData.map((_, idx) => (
//                     <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={tooltipStyle}
//                   formatter={(v) => [v, "Sold"]}
//                 />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Motion.div>

//           <Motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.35 }}
//             className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
//           >
//             <h3
//               className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
//             >
//               Revenue per Ticket Type
//             </h3>
//             <div className="space-y-3">
//               {ticketTypeData
//                 .sort((a, b) => b.revenue - a.revenue)
//                 .map((type, idx) => (
//                   <div key={idx} className="flex items-center gap-3">
//                     <div
//                       className="w-3 h-3 rounded-full flex-shrink-0"
//                       style={{ background: COLORS[idx % COLORS.length] }}
//                     />
//                     <div className="flex-1">
//                       <div className="flex justify-between mb-1">
//                         <span
//                           className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
//                         >
//                           {type.name}
//                         </span>
//                         <span
//                           className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
//                         >
//                           {formatNaira(type.revenue)} · {type.sold} sold
//                         </span>
//                       </div>
//                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                         <div
//                           className="h-full rounded-full"
//                           style={{
//                             width: `${ticketTypeData[0]?.revenue > 0 ? (type.revenue / ticketTypeData[0].revenue) * 100 : 0}%`,
//                             background: COLORS[idx % COLORS.length],
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </Motion.div>
//         </div>
//       )}

//       {/* Attendance placeholder */}
//       <Motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4 }}
//         className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg border-2 border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}
//       >
//         <div className="flex items-center gap-3 mb-2">
//           <AlertCircle className="w-5 h-5 text-yellow-500" />
//           <h3
//             className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
//           >
//             QR Scan Attendance Analytics
//           </h3>
//         </div>
//         <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//           Once you implement QR code scanning at your events, this section will
//           show check-in rates, peak arrival times, and no-show statistics.
//         </p>
//       </Motion.div>
//     </Motion.div>
//   );
// };

// export default PlannerAnalytics;
