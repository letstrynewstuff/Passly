
// // src/pages/admin/AdminDashboard.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import {
//   LayoutDashboard,
//   TrendingUp,
//   Users,
//   Calendar,
//   Wallet,
//   CheckCircle,
//   XCircle,
//   Trash2,
//   ShieldCheck,
//   ShieldOff,
//   Clock,
//   BadgeCheck,
//   AlertTriangle,
//   ChevronRight,
//   DollarSign,
//   Ticket,
//   RefreshCw,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// const fmt = (v) => `₦${Number(v || 0).toLocaleString()}`;
// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-NG", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const STATUS_CONFIG = {
//   pending: {
//     color: "text-yellow-400",
//     bg: "bg-yellow-400/10",
//     dot: "bg-yellow-400",
//     label: "Pending",
//   },
//   approved: {
//     color: "text-emerald-400",
//     bg: "bg-emerald-400/10",
//     dot: "bg-emerald-400",
//     label: "Approved",
//   },
//   rejected: {
//     color: "text-red-400",
//     bg: "bg-red-400/10",
//     dot: "bg-red-400",
//     label: "Rejected",
//   },
//   paid: {
//     color: "text-blue-400",
//     bg: "bg-blue-400/10",
//     dot: "bg-blue-400",
//     label: "Paid",
//   },
//   deleted: {
//     color: "text-gray-500",
//     bg: "bg-gray-500/10",
//     dot: "bg-gray-500",
//     label: "Deleted",
//   },
// };

// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// const StatCard = ({ icon, label, value, sub, accent, delay = 0 }) => {
//   const Icon = icon; // capitalised for JSX rendering

//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.4 }}
//       className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col gap-4"
//     >
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500 font-medium">{label}</p>
//         <div className="p-2 rounded-xl" style={{ background: `${accent}18` }}>
//           <Icon className="w-4 h-4" style={{ color: accent }} />
//         </div>
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-white tracking-tight break-all">
//           {value}
//         </p>
//         {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
//       </div>
//     </Motion.div>
//   );
// };

// const SectionHeader = ({ title, subtitle }) => (
//   <div className="mb-5">
//     <h2 className="text-lg font-bold text-white">{title}</h2>
//     {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
//   </div>
// );

// // ─── Action button ────────────────────────────────────────────────────────────
// const ActionBtn = ({ onClick, icon, label, variant = "default", loading }) => {
//   // keep a capitalised reference for rendering
//   const Icon = icon;
//   const styles = {
//     default: "bg-white/5 hover:bg-white/10 text-gray-300",
//     success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400",
//     danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400",
//     warning: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400",
//     blue: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400",
//   };
//   return (
//     <button
//       onClick={onClick}
//       disabled={loading}
//       title={label}
//       className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${styles[variant]}`}
//     >
//       {loading ? (
//         <RefreshCw className="w-3 h-3 animate-spin" />
//       ) : (
//         <Icon className="w-3 h-3" />
//       )}
//       {label}
//     </button>
//   );
// };

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const [token, setToken] = useState(
//     () => localStorage.getItem("adminToken") || "",
//   );
//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginError, setLoginError] = useState("");
//   const [loginLoading, setLoginLoading] = useState(false);

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState({});
//   const [activeTab, setActiveTab] = useState("overview");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [toast, setToast] = useState(null);

//   const api = axios.create({
//     baseURL: API_BASE,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // ── Login ──────────────────────────────────────────────────────────────────
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoginLoading(true);
//     setLoginError("");
//     try {
//       const res = await axios.post(`${API_BASE}/admin/login`, loginForm);
//       if (res.data.success) {
//         localStorage.setItem("adminToken", res.data.token);
//         setToken(res.data.token);
//       }
//     } catch {
//       setLoginError("Invalid email or password");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     setToken("");
//     setStats(null);
//   };

//   // ── Fetch stats ────────────────────────────────────────────────────────────
//   const fetchStats = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await api.get("/admin/stats");
//       if (res.data.success) setStats(res.data.stats);
//     } catch (err) {
//       if (err.response?.status === 401) handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   // ── Actions ────────────────────────────────────────────────────────────────
//   const action = async (key, fn) => {
//     setActionLoading((p) => ({ ...p, [key]: true }));
//     try {
//       await fn();
//       await fetchStats();
//       showToast("Action completed successfully");
//     } catch {
//       showToast("Something went wrong", "error");
//     } finally {
//       setActionLoading((p) => ({ ...p, [key]: false }));
//     }
//   };

//   const approveEvent = (id) =>
//     action(`ev-approve-${id}`, () => api.patch(`/admin/events/${id}/approve`));
//   const rejectEvent = (id) =>
//     action(`ev-reject-${id}`, () => api.patch(`/admin/events/${id}/reject`));
//   const deleteEvent = (id) =>
//     action(`ev-delete-${id}`, () => api.delete(`/admin/events/${id}`));
//   const verifyPlanner = (id) =>
//     action(`pl-verify-${id}`, () => api.patch(`/admin/planners/${id}/verify`));
//   const suspendPlanner = (id) =>
//     action(`pl-suspend-${id}`, () =>
//       api.patch(`/admin/planners/${id}/suspend`),
//     );
//   const unsuspend = (id) =>
//     action(`pl-unsuspend-${id}`, () =>
//       api.patch(`/admin/planners/${id}/unsuspend`),
//     );
//   const approveW = (id) =>
//     action(`w-approve-${id}`, () =>
//       api.patch(`/admin/withdrawals/${id}/approve`),
//     );
//   const rejectW = (id) =>
//     action(`w-reject-${id}`, () =>
//       api.patch(`/admin/withdrawals/${id}/reject`),
//     );
//   const paidW = (id) =>
//     action(`w-paid-${id}`, () => api.patch(`/admin/withdrawals/${id}/paid`));

//   // ── Login Screen ───────────────────────────────────────────────────────────
//   if (!token) {
//     return (
//       <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
//         <Motion.div
//           initial={{ opacity: 0, scale: 0.96 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="w-full max-w-sm"
//         >
//           <div className="text-center mb-8">
//             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4">
//               <ShieldCheck className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Sign in to manage the platform
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1.5">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={loginForm.email}
//                 onChange={(e) =>
//                   setLoginForm((p) => ({ ...p, email: e.target.value }))
//                 }
//                 className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors"
//                 placeholder="admin@example.com"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1.5">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={loginForm.password}
//                 onChange={(e) =>
//                   setLoginForm((p) => ({ ...p, password: e.target.value }))
//                 }
//                 className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//             {loginError && (
//               <p className="text-red-400 text-sm text-center">{loginError}</p>
//             )}
//             <button
//               type="submit"
//               disabled={loginLoading}
//               className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {loginLoading ? (
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//               ) : null}
//               {loginLoading ? "Signing in…" : "Sign In"}
//             </button>
//           </form>
//         </Motion.div>
//       </div>
//     );
//   }

//   const NAV_TABS = [
//     { id: "overview", label: "Overview", icon: LayoutDashboard },
//     { id: "events", label: "Events", icon: Calendar },
//     { id: "planners", label: "Planners", icon: Users },
//     { id: "withdrawals", label: "Withdrawals", icon: Wallet },
//   ];

//   // ─── Main Layout ───────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">
//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <Motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${
//               toast.type === "error"
//                 ? "bg-red-500/90 text-white"
//                 : "bg-emerald-500/90 text-white"
//             }`}
//           >
//             {toast.msg}
//           </Motion.div>
//         )}
//       </AnimatePresence>

//       {/* Top Nav */}
//       <header className="sticky top-0 z-40 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 h-14 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
//             <ShieldCheck className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-sm">Admin Panel</span>
//         </div>

//         {/* Desktop nav */}
//         <nav className="hidden md:flex items-center gap-1">
//           {NAV_TABS.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                 activeTab === tab.id
//                   ? "bg-white/10 text-white"
//                   : "text-gray-500 hover:text-gray-300"
//               }`}
//             >
//               <tab.icon className="w-4 h-4" />
//               {tab.label}
//             </button>
//           ))}
//         </nav>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={fetchStats}
//             className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
//             title="Refresh"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           </button>
//           <button
//             onClick={handleLogout}
//             className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
//             title="Logout"
//           >
//             <LogOut className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded-lg text-gray-500 hover:text-white"
//           >
//             {mobileMenuOpen ? (
//               <X className="w-4 h-4" />
//             ) : (
//               <Menu className="w-4 h-4" />
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Mobile nav */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <Motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="md:hidden overflow-hidden bg-[#111827] border-b border-white/5"
//           >
//             {NAV_TABS.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
//                   activeTab === tab.id
//                     ? "text-white bg-white/5"
//                     : "text-gray-500"
//                 }`}
//               >
//                 <tab.icon className="w-4 h-4" />
//                 {tab.label}
//               </button>
//             ))}
//           </Motion.div>
//         )}
//       </AnimatePresence>

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
//         {loading && !stats ? (
//           <div className="flex items-center justify-center py-24">
//             <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
//           </div>
//         ) : !stats ? (
//           <div className="text-center py-24 text-gray-500">
//             No data available
//           </div>
//         ) : (
//           <AnimatePresence mode="wait">
//             <Motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               {/* ══════════════ OVERVIEW ══════════════ */}
//               {activeTab === "overview" && (
//                 <div className="space-y-8">
//                   {/* Stat cards */}
//                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                     <StatCard
//                       icon={DollarSign}
//                       label="Gross Revenue"
//                       value={fmt(stats.totalRevenue)}
//                       sub="all approved events"
//                       accent="#a78bfa"
//                       delay={0}
//                     />
//                     <StatCard
//                       icon={TrendingUp}
//                       label="Platform Commission"
//                       value={fmt(stats.platformCommission)}
//                       sub="10% of gross"
//                       accent="#f472b6"
//                       delay={0.05}
//                     />
//                     <StatCard
//                       icon={Ticket}
//                       label="Tickets Sold"
//                       value={stats.totalTicketsSold?.toLocaleString()}
//                       sub="approved events"
//                       accent="#34d399"
//                       delay={0.1}
//                     />
//                     <StatCard
//                       icon={Wallet}
//                       label="Total Paid Out"
//                       value={fmt(stats.totalPaidOut)}
//                       sub="completed withdrawals"
//                       accent="#60a5fa"
//                       delay={0.15}
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                     <StatCard
//                       icon={Calendar}
//                       label="Total Events"
//                       value={stats.totalEvents}
//                       sub={`${stats.pendingEvents} pending`}
//                       accent="#fb923c"
//                       delay={0.2}
//                     />
//                     <StatCard
//                       icon={CheckCircle}
//                       label="Approved Events"
//                       value={stats.approvedEvents}
//                       sub="live on platform"
//                       accent="#34d399"
//                       delay={0.25}
//                     />
//                     <StatCard
//                       icon={Users}
//                       label="Planners"
//                       value={stats.totalPlanners}
//                       sub="registered"
//                       accent="#a78bfa"
//                       delay={0.3}
//                     />
//                     <StatCard
//                       icon={AlertTriangle}
//                       label="Pending Withdrawals"
//                       value={stats.pendingWithdrawals}
//                       sub="awaiting action"
//                       accent="#facc15"
//                       delay={0.35}
//                     />
//                   </div>

//                   {/* Revenue chart */}
//                   {stats.topEvents?.length > 0 && (
//                     <Motion.div
//                       initial={{ opacity: 0, y: 16 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.4 }}
//                       className="bg-[#111827] border border-white/5 rounded-2xl p-6"
//                     >
//                       <SectionHeader
//                         title="Top Events by Revenue"
//                         subtitle="Approved events only"
//                       />
//                       <ResponsiveContainer width="100%" height={220}>
//                         <BarChart data={stats.topEvents} barCategoryGap="35%">
//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#ffffff08"
//                           />
//                           <XAxis
//                             dataKey="title"
//                             tick={{ fontSize: 11, fill: "#6b7280" }}
//                           />
//                           <YAxis
//                             tick={{ fontSize: 11, fill: "#6b7280" }}
//                             tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               background: "#1f2937",
//                               border: "none",
//                               borderRadius: 12,
//                               color: "#f9fafb",
//                             }}
//                             formatter={(v) => [fmt(v), "Revenue"]}
//                           />
//                           <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
//                             {stats.topEvents.map((_, i) => (
//                               <Cell
//                                 key={i}
//                                 fill={
//                                   [
//                                     "#a78bfa",
//                                     "#f472b6",
//                                     "#34d399",
//                                     "#60a5fa",
//                                     "#fb923c",
//                                   ][i % 5]
//                                 }
//                               />
//                             ))}
//                           </Bar>
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </Motion.div>
//                   )}

//                   {/* Recent events + recent withdrawals side by side */}
//                   <div className="grid lg:grid-cols-2 gap-6">
//                     {/* Recent events */}
//                     <Motion.div
//                       initial={{ opacity: 0, y: 16 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.45 }}
//                       className="bg-[#111827] border border-white/5 rounded-2xl p-6"
//                     >
//                       <div className="flex items-center justify-between mb-5">
//                         <SectionHeader title="Recent Events" />
//                         <button
//                           onClick={() => setActiveTab("events")}
//                           className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
//                         >
//                           View all <ChevronRight className="w-3 h-3" />
//                         </button>
//                       </div>
//                       <div className="space-y-3">
//                         {stats.recentEvents?.length === 0 && (
//                           <p className="text-gray-600 text-sm">No events yet</p>
//                         )}
//                         {stats.recentEvents?.map((event) => (
//                           <div
//                             key={event._id}
//                             className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
//                           >
//                             {event.media ? (
//                               <img
//                                 src={event.media}
//                                 className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
//                               />
//                             ) : (
//                               <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
//                                 <Calendar className="w-4 h-4 text-gray-600" />
//                               </div>
//                             )}
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-white truncate">
//                                 {event.title}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {event.planner?.username || "Unknown"} ·{" "}
//                                 {fmtDate(event.createdAt)}
//                               </p>
//                             </div>
//                             <div className="flex flex-col items-end gap-1 flex-shrink-0">
//                               <StatusBadge status={event.status} />
//                               <span className="text-xs text-gray-500">
//                                 {event.ticketsSold} sold
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </Motion.div>

//                     {/* Recent withdrawals */}
//                     <Motion.div
//                       initial={{ opacity: 0, y: 16 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.5 }}
//                       className="bg-[#111827] border border-white/5 rounded-2xl p-6"
//                     >
//                       <div className="flex items-center justify-between mb-5">
//                         <SectionHeader title="Recent Withdrawals" />
//                         <button
//                           onClick={() => setActiveTab("withdrawals")}
//                           className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
//                         >
//                           View all <ChevronRight className="w-3 h-3" />
//                         </button>
//                       </div>
//                       <div className="space-y-3">
//                         {stats.recentWithdrawals?.length === 0 && (
//                           <p className="text-gray-600 text-sm">
//                             No withdrawal requests yet
//                           </p>
//                         )}
//                         {stats.recentWithdrawals?.map((w) => (
//                           <div
//                             key={w._id}
//                             className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]"
//                           >
//                             <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
//                               <Wallet className="w-4 h-4 text-violet-400" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-white truncate">
//                                 {w.plannerId?.companyName ||
//                                   w.plannerId?.username ||
//                                   "Planner"}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {fmtDate(w.createdAt)}
//                               </p>
//                             </div>
//                             <div className="flex flex-col items-end gap-1 flex-shrink-0">
//                               <span className="text-sm font-bold text-white">
//                                 {fmt(w.amount)}
//                               </span>
//                               <StatusBadge status={w.status} />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </Motion.div>
//                   </div>
//                 </div>
//               )}

//               {/* ══════════════ EVENTS ══════════════ */}
//               {activeTab === "events" && (
//                 <EventsTab
//                   token={token}
//                   api={api}
//                   actionLoading={actionLoading}
//                   onApprove={approveEvent}
//                   onReject={rejectEvent}
//                   onDelete={deleteEvent}
//                 />
//               )}

//               {/* ══════════════ PLANNERS ══════════════ */}
//               {activeTab === "planners" && (
//                 <PlannersTab
//                   token={token}
//                   api={api}
//                   actionLoading={actionLoading}
//                   onVerify={verifyPlanner}
//                   onSuspend={suspendPlanner}
//                   onUnsuspend={unsuspend}
//                 />
//               )}

//               {/* ══════════════ WITHDRAWALS ══════════════ */}
//               {activeTab === "withdrawals" && (
//                 <WithdrawalsTab
//                   token={token}
//                   api={api}
//                   actionLoading={actionLoading}
//                   onApprove={approveW}
//                   onReject={rejectW}
//                   onPaid={paidW}
//                 />
//               )}
//             </Motion.div>
//           </AnimatePresence>
//         )}
//       </main>
//     </div>
//   );
// }

// // ─── Events Tab ───────────────────────────────────────────────────────────────
// function EventsTab({ api, actionLoading, onApprove, onReject, onDelete }) {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     api
//       .get("/admin/events")
//       .then((r) => {
//         if (r.data.success) setEvents(r.data.events);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = events.filter((e) => {
//     const matchStatus = filter === "all" || e.status === filter;
//     const matchSearch =
//       !search ||
//       e.title.toLowerCase().includes(search.toLowerCase()) ||
//       e.createdBy?.username?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchSearch;
//   });

//   return (
//     <div>
//       <SectionHeader
//         title="Event Management"
//         subtitle={`${events.length} total events`}
//       />

//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search events or planner…"
//           className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
//         />
//         <div className="flex gap-2 flex-wrap">
//           {["all", "pending", "approved", "rejected"].map((s) => (
//             <button
//               key={s}
//               onClick={() => setFilter(s)}
//               className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
//                 filter === s
//                   ? "bg-violet-500/20 text-violet-400"
//                   : "bg-white/5 text-gray-500 hover:text-gray-300"
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-16">
//           <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
//         </div>
//       ) : (
//         <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/5">
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Event
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Planner
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Tickets Sold
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Revenue
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/[0.03]">
//                 {filtered.length === 0 && (
//                   <tr>
//                     <td colSpan={7} className="text-center py-12 text-gray-600">
//                       No events found
//                     </td>
//                   </tr>
//                 )}
//                 {filtered.map((event) => (
//                   <tr
//                     key={event._id}
//                     className="hover:bg-white/[0.02] transition-colors"
//                   >
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         {event.media?.[0] ? (
//                           <img
//                             src={event.media[0]}
//                             className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
//                           />
//                         ) : (
//                           <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
//                             <Calendar className="w-4 h-4 text-gray-600" />
//                           </div>
//                         )}
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium text-white truncate max-w-[180px]">
//                             {event.title}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {event.location || "No location"}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-300">
//                           {event.createdBy?.username || "—"}
//                         </span>
//                         {event.createdBy?.isVerified && (
//                           <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-5 py-4 text-sm text-gray-300">
//                       {event.ticketsSold || 0}
//                     </td>
//                     <td className="px-5 py-4 text-sm font-medium text-white">
//                       {fmt(event.revenue)}
//                     </td>
//                     <td className="px-5 py-4">
//                       <StatusBadge status={event.status} />
//                     </td>
//                     <td className="px-5 py-4 text-sm text-gray-500">
//                       {fmtDate(event.date)}
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-end gap-1.5 flex-wrap">
//                         {event.status !== "approved" && (
//                           <ActionBtn
//                             icon={CheckCircle}
//                             label="Approve"
//                             variant="success"
//                             loading={actionLoading[`ev-approve-${event._id}`]}
//                             onClick={() => onApprove(event._id)}
//                           />
//                         )}
//                         {event.status !== "rejected" && (
//                           <ActionBtn
//                             icon={XCircle}
//                             label="Reject"
//                             variant="danger"
//                             loading={actionLoading[`ev-reject-${event._id}`]}
//                             onClick={() => onReject(event._id)}
//                           />
//                         )}
//                         <ActionBtn
//                           icon={Trash2}
//                           label="Delete"
//                           variant="danger"
//                           loading={actionLoading[`ev-delete-${event._id}`]}
//                           onClick={() => onDelete(event._id)}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Planners Tab ─────────────────────────────────────────────────────────────
// function PlannersTab({ api, actionLoading, onVerify, onSuspend, onUnsuspend }) {
//   const [planners, setPlanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     api
//       .get("/admin/planners")
//       .then((r) => {
//         if (r.data.success) setPlanners(r.data.planners);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = planners.filter(
//     (p) =>
//       !search ||
//       p.username?.toLowerCase().includes(search.toLowerCase()) ||
//       p.email?.toLowerCase().includes(search.toLowerCase()) ||
//       p.companyName?.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div>
//       <SectionHeader
//         title="Planner Management"
//         subtitle={`${planners.length} planners registered`}
//       />

//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search planners…"
//         className="w-full mb-6 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
//       />

//       {loading ? (
//         <div className="flex justify-center py-16">
//           <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
//         </div>
//       ) : (
//         <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/5">
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Planner
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Events
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Revenue
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Joined
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/[0.03]">
//                 {filtered.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-12 text-gray-600">
//                       No planners found
//                     </td>
//                   </tr>
//                 )}
//                 {filtered.map((planner) => (
//                   <tr
//                     key={planner._id}
//                     className="hover:bg-white/[0.02] transition-colors"
//                   >
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={`https://api.dicebear.com/7.x/${planner.avatarStyle || "adventurer"}/svg?seed=${planner.username}`}
//                           className="w-9 h-9 rounded-full bg-white/5 flex-shrink-0"
//                         />
//                         <div className="min-w-0">
//                           <div className="flex items-center gap-1.5">
//                             <p className="text-sm font-medium text-white truncate">
//                               {planner.username}
//                             </p>
//                             {planner.isVerified && (
//                               <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
//                             )}
//                           </div>
//                           <p className="text-xs text-gray-500 truncate max-w-[160px]">
//                             {planner.companyName || planner.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4 text-sm text-gray-300">
//                       {planner.eventCount || 0} events
//                     </td>
//                     <td className="px-5 py-4 text-sm font-medium text-white">
//                       {fmt(planner.revenue)}
//                     </td>
//                     <td className="px-5 py-4 text-sm text-gray-500">
//                       {fmtDate(planner.createdAt)}
//                     </td>
//                     <td className="px-5 py-4">
//                       {planner.isSuspended ? (
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-red-400 bg-red-400/10">
//                           <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
//                           Suspended
//                         </span>
//                       ) : planner.isVerified ? (
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-400/10">
//                           <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
//                           Verified
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-400 bg-gray-400/10">
//                           <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
//                           Unverified
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-end gap-1.5 flex-wrap">
//                         {!planner.isVerified && !planner.isSuspended && (
//                           <ActionBtn
//                             icon={BadgeCheck}
//                             label="Verify"
//                             variant="blue"
//                             loading={actionLoading[`pl-verify-${planner._id}`]}
//                             onClick={() => onVerify(planner._id)}
//                           />
//                         )}
//                         {!planner.isSuspended ? (
//                           <ActionBtn
//                             icon={ShieldOff}
//                             label="Suspend"
//                             variant="danger"
//                             loading={actionLoading[`pl-suspend-${planner._id}`]}
//                             onClick={() => onSuspend(planner._id)}
//                           />
//                         ) : (
//                           <ActionBtn
//                             icon={ShieldCheck}
//                             label="Unsuspend"
//                             variant="success"
//                             loading={
//                               actionLoading[`pl-unsuspend-${planner._id}`]
//                             }
//                             onClick={() => onUnsuspend(planner._id)}
//                           />
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Withdrawals Tab ──────────────────────────────────────────────────────────
// function WithdrawalsTab({ api, actionLoading, onApprove, onReject, onPaid }) {
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     api
//       .get("/admin/withdrawals")
//       .then((r) => {
//         if (r.data.success) setWithdrawals(r.data.withdrawals);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = withdrawals.filter(
//     (w) => filter === "all" || w.status === filter,
//   );

//   const totals = {
//     pending: withdrawals
//       .filter((w) => w.status === "pending")
//       .reduce((s, w) => s + w.amount, 0),
//     approved: withdrawals
//       .filter((w) => w.status === "approved")
//       .reduce((s, w) => s + w.amount, 0),
//     paid: withdrawals
//       .filter((w) => w.status === "paid")
//       .reduce((s, w) => s + w.amount, 0),
//   };

//   return (
//     <div>
//       <SectionHeader
//         title="Withdrawal Management"
//         subtitle="Planner payout requests"
//       />

//       {/* Summary */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         {[
//           {
//             label: "Pending",
//             value: totals.pending,
//             color: "text-yellow-400",
//             bg: "bg-yellow-400/5",
//           },
//           {
//             label: "Approved",
//             value: totals.approved,
//             color: "text-emerald-400",
//             bg: "bg-emerald-400/5",
//           },
//           {
//             label: "Paid Out",
//             value: totals.paid,
//             color: "text-blue-400",
//             bg: "bg-blue-400/5",
//           },
//         ].map((s) => (
//           <div
//             key={s.label}
//             className={`${s.bg} border border-white/5 rounded-xl p-4 text-center`}
//           >
//             <p className="text-xs text-gray-500 mb-1">{s.label}</p>
//             <p className={`text-lg font-bold ${s.color} break-all`}>
//               {fmt(s.value)}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Filter */}
//       <div className="flex gap-2 mb-5 flex-wrap">
//         {["all", "pending", "approved", "paid", "rejected"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setFilter(s)}
//             className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
//               filter === s
//                 ? "bg-violet-500/20 text-violet-400"
//                 : "bg-white/5 text-gray-500 hover:text-gray-300"
//             }`}
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-16">
//           <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
//         </div>
//       ) : (
//         <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/5">
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Planner
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Bank Details
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Requested
//                   </th>
//                   <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/[0.03]">
//                 {filtered.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-12 text-gray-600">
//                       No withdrawals found
//                     </td>
//                   </tr>
//                 )}
//                 {filtered.map((w) => (
//                   <tr
//                     key={w._id}
//                     className="hover:bg-white/[0.02] transition-colors"
//                   >
//                     <td className="px-5 py-4">
//                       <p className="text-sm font-medium text-white">
//                         {w.plannerId?.companyName ||
//                           w.plannerId?.username ||
//                           "—"}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {w.plannerId?.email}
//                       </p>
//                     </td>
//                     <td className="px-5 py-4">
//                       <p className="text-sm text-gray-300">{w.bankName}</p>
//                       <p className="text-xs text-gray-500">
//                         {w.accountNumber} · {w.accountName}
//                       </p>
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className="text-sm font-bold text-white">
//                         {fmt(w.amount)}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4 text-sm text-gray-500">
//                       {fmtDate(w.createdAt)}
//                     </td>
//                     <td className="px-5 py-4">
//                       <StatusBadge status={w.status} />
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-end gap-1.5 flex-wrap">
//                         {w.status === "pending" && (
//                           <>
//                             <ActionBtn
//                               icon={CheckCircle}
//                               label="Approve"
//                               variant="success"
//                               loading={actionLoading[`w-approve-${w._id}`]}
//                               onClick={() => onApprove(w._id)}
//                             />
//                             <ActionBtn
//                               icon={XCircle}
//                               label="Reject"
//                               variant="danger"
//                               loading={actionLoading[`w-reject-${w._id}`]}
//                               onClick={() => onReject(w._id)}
//                             />
//                           </>
//                         )}
//                         {w.status === "approved" && (
//                           <ActionBtn
//                             icon={CheckCircle}
//                             label="Mark Paid"
//                             variant="blue"
//                             loading={actionLoading[`w-paid-${w._id}`]}
//                             onClick={() => onPaid(w._id)}
//                           />
//                         )}
//                         {(w.status === "paid" || w.status === "rejected") && (
//                           <span className="text-xs text-gray-600">
//                             {w.status === "paid" ? "Completed" : "Declined"} ·{" "}
//                             {fmtDate(w.processedAt)}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// // src/admin/AdminDashboard.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import {
//   LayoutDashboard,
//   Users,
//   Calendar,
//   Wallet,
//   CheckCircle,
//   ShieldCheck,
//   BadgeCheck,
//   RefreshCw,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// // Sub-pages
// import Overview        from "./Overview";
// import EventsPage      from "./EventsPage";
// import AdminPlannerList from "./AdminPlannerList";
// import WithdrawalPage  from "./Withdrawals";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // ─── Nav tabs ─────────────────────────────────────────────────────────────────
// const NAV_TABS = [
//   { id: "overview",    label: "Overview",    icon: LayoutDashboard },
//   { id: "events",      label: "Events",      icon: Calendar },
//   { id: "planners",    label: "Planners",    icon: Users },
//   { id: "withdrawals", label: "Withdrawals", icon: Wallet },
// ];

// export default function AdminDashboard() {
//   const [token, setToken] = useState(
//     () => localStorage.getItem("adminToken") || "",
//   );
//   const [loginForm, setLoginForm]     = useState({ email: "", password: "" });
//   const [loginError, setLoginError]   = useState("");
//   const [loginLoading, setLoginLoading] = useState(false);

//   const [stats, setStats]               = useState(null);
//   const [loading, setLoading]           = useState(false);
//   const [actionLoading, setActionLoading] = useState({});
//   const [activeTab, setActiveTab]       = useState("overview");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [toast, setToast]               = useState(null);

//   // Axios instance with admin token
//   const api = axios.create({
//     baseURL: API_BASE,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // ── Login ────────────────────────────────────────────────────────────────
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoginLoading(true);
//     setLoginError("");
//     try {
//       const res = await axios.post(`${API_BASE}/admin/login`, loginForm);
//       if (res.data.success) {
//         localStorage.setItem("adminToken", res.data.token);
//         setToken(res.data.token);
//       }
//     } catch {
//       setLoginError("Invalid email or password");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     setToken("");
//     setStats(null);
//   };

//   // ── Fetch dashboard stats ────────────────────────────────────────────────
//   const fetchStats = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await api.get("/admin/stats");
//       if (res.data.success) setStats(res.data.stats);
//     } catch (err) {
//       if (err.response?.status === 401) handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   // ── Generic action runner (re-fetches stats after every action) ──────────
//   const action = async (key, fn) => {
//     setActionLoading((p) => ({ ...p, [key]: true }));
//     try {
//       await fn();
//       await fetchStats();
//       showToast("Action completed successfully");
//     } catch {
//       showToast("Something went wrong", "error");
//     } finally {
//       setActionLoading((p) => ({ ...p, [key]: false }));
//     }
//   };

//   // ── Action helpers passed down to sub-pages ──────────────────────────────
//   const approveEvent   = (id) => action(`ev-approve-${id}`, () => api.patch(`/admin/events/${id}/approve`));
//   const rejectEvent    = (id) => action(`ev-reject-${id}`,  () => api.patch(`/admin/events/${id}/reject`));
//   const deleteEvent    = (id) => action(`ev-delete-${id}`,  () => api.delete(`/admin/events/${id}`));

//   const verifyPlanner  = (id) => action(`pl-verify-${id}`,    () => api.patch(`/admin/planners/${id}/verify`));
//   const suspendPlanner = (id) => action(`pl-suspend-${id}`,   () => api.patch(`/admin/planners/${id}/suspend`));
//   const unsuspend      = (id) => action(`pl-unsuspend-${id}`, () => api.patch(`/admin/planners/${id}/unsuspend`));

//   const approveW = (id) => action(`w-approve-${id}`, () => api.patch(`/admin/withdrawals/${id}/approve`));
//   const rejectW  = (id) => action(`w-reject-${id}`,  () => api.patch(`/admin/withdrawals/${id}/reject`));
//   const paidW    = (id) => action(`w-paid-${id}`,    () => api.patch(`/admin/withdrawals/${id}/paid`));

//   // ── Login screen ─────────────────────────────────────────────────────────
//   if (!token) {
//     return (
//       <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
//         <Motion.div
//           initial={{ opacity: 0, scale: 0.96 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="w-full max-w-sm"
//         >
//           <div className="text-center mb-8">
//             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4">
//               <ShieldCheck className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Sign in to manage the platform
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1.5">Email</label>
//               <input
//                 type="email"
//                 value={loginForm.email}
//                 onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
//                 className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors"
//                 placeholder="admin@example.com"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1.5">Password</label>
//               <input
//                 type="password"
//                 value={loginForm.password}
//                 onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
//                 className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             {loginError && (
//               <p className="text-red-400 text-sm text-center">{loginError}</p>
//             )}

//             <button
//               type="submit"
//               disabled={loginLoading}
//               className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {loginLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
//               {loginLoading ? "Signing in…" : "Sign In"}
//             </button>
//           </form>
//         </Motion.div>
//       </div>
//     );
//   }

//   // ── Main dashboard shell ─────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">

//       {/* Toast notification */}
//       <AnimatePresence>
//         {toast && (
//           <Motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${
//               toast.type === "error"
//                 ? "bg-red-500/90 text-white"
//                 : "bg-emerald-500/90 text-white"
//             }`}
//           >
//             {toast.msg}
//           </Motion.div>
//         )}
//       </AnimatePresence>

//       {/* Top nav bar */}
//       <header className="sticky top-0 z-40 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 h-14 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
//             <ShieldCheck className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-sm">Admin Panel</span>
//         </div>

//         {/* Desktop nav */}
//         <nav className="hidden md:flex items-center gap-1">
//           {NAV_TABS.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                 activeTab === tab.id
//                   ? "bg-white/10 text-white"
//                   : "text-gray-500 hover:text-gray-300"
//               }`}
//             >
//               <tab.icon className="w-4 h-4" />
//               {tab.label}
//             </button>
//           ))}
//         </nav>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={fetchStats}
//             title="Refresh"
//             className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           </button>
//           <button
//             onClick={handleLogout}
//             title="Logout"
//             className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
//           >
//             <LogOut className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded-lg text-gray-500 hover:text-white"
//           >
//             {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//           </button>
//         </div>
//       </header>

//       {/* Mobile nav dropdown */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <Motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="md:hidden overflow-hidden bg-[#111827] border-b border-white/5"
//           >
//             {NAV_TABS.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
//                   activeTab === tab.id ? "text-white bg-white/5" : "text-gray-500"
//                 }`}
//               >
//                 <tab.icon className="w-4 h-4" />
//                 {tab.label}
//               </button>
//             ))}
//           </Motion.div>
//         )}
//       </AnimatePresence>

//       {/* Page content */}
//       <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
//         {loading && !stats ? (
//           <div className="flex items-center justify-center py-24">
//             <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
//           </div>
//         ) : !stats ? (
//           <div className="text-center py-24 text-gray-500">No data available</div>
//         ) : (
//           <AnimatePresence mode="wait">
//             <Motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               {activeTab === "overview" && (
//                 <Overview stats={stats} onNavigate={setActiveTab} />
//               )}

//               {activeTab === "events" && (
//                 <EventsPage
//                   api={api}
//                   actionLoading={actionLoading}
//                   onApprove={approveEvent}
//                   onReject={rejectEvent}
//                   onDelete={deleteEvent}
//                 />
//               )}

//               {activeTab === "planners" && (
//                 <AdminPlannerList
//                   api={api}
//                   actionLoading={actionLoading}
//                   onVerify={verifyPlanner}
//                   onSuspend={suspendPlanner}
//                   onUnsuspend={unsuspend}
//                 />
//               )}

//               {activeTab === "withdrawals" && (
//                 <WithdrawalPage
//                   api={api}
//                   actionLoading={actionLoading}
//                   onApprove={approveW}
//                   onReject={rejectW}
//                   onPaid={paidW}
//                 />
//               )}
//             </Motion.div>
//           </AnimatePresence>
//         )}
//       </main>
//     </div>
//   );
// }


// src/admin/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  LayoutDashboard, Users, Calendar, Wallet,
  ShieldCheck, RefreshCw, LogOut, Menu, X, Car, UserCircle,
} from "lucide-react";

import Overview         from "./Overview";
import EventsPage       from "./EventsPage";
import AdminPlannerList from "./AdminPlannerList";
import WithdrawalPage   from "./Withdrawals";
import AdminLogistics   from "./AdminLogistics";
import AdminUserList    from "./AdminUserList";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NAV_TABS = [
  { id: "overview",    label: "Overview",    icon: LayoutDashboard },
  { id: "events",      label: "Events",      icon: Calendar        },
  { id: "planners",    label: "Planners",    icon: Users           },
  { id: "withdrawals", label: "Withdrawals", icon: Wallet          },
  { id: "logistics",   label: "Logistics",   icon: Car             },
  { id: "users",       label: "Users",       icon: UserCircle      },
];

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [loginForm,    setLoginForm]    = useState({ email: "", password: "" });
  const [loginError,   setLoginError]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab,     setActiveTab]     = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast,    setToast]    = useState(null);
  const [withdrawalRefreshKey, setWithdrawalRefreshKey] = useState(0);

  const api = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, loginForm);
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        setToken(res.data.token);
      }
    } catch {
      setLoginError("Invalid email or password");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setStats(null);
  };

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const action = async (key, fn) => {
    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      await fn();
      await fetchStats();
      showToast("Action completed successfully");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };

  const approveEvent   = (id) => action(`ev-approve-${id}`, () => api.patch(`/admin/events/${id}/approve`));
  const rejectEvent    = (id) => action(`ev-reject-${id}`,  () => api.patch(`/admin/events/${id}/reject`));
  const deleteEvent    = (id) => action(`ev-delete-${id}`,  () => api.delete(`/admin/events/${id}`));
  const verifyPlanner  = (id) => action(`pl-verify-${id}`,    () => api.patch(`/admin/planners/${id}/verify`));
  const suspendPlanner = (id) => action(`pl-suspend-${id}`,   () => api.patch(`/admin/planners/${id}/suspend`));
  const unsuspend      = (id) => action(`pl-unsuspend-${id}`, () => api.patch(`/admin/planners/${id}/unsuspend`));

  const approveW = (id) => action(`w-approve-${id}`, () => api.patch(`/admin/withdrawals/${id}/approve`)).finally(() => setWithdrawalRefreshKey(k => k + 1));
  const rejectW  = (id) => action(`w-reject-${id}`,  () => api.patch(`/admin/withdrawals/${id}/reject`)).finally(() => setWithdrawalRefreshKey(k => k + 1));
  const paidW    = (id) => action(`w-paid-${id}`,    () => api.patch(`/admin/withdrawals/${id}/paid`)).finally(() => setWithdrawalRefreshKey(k => k + 1));

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
        <Motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to manage the platform</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input type="email" value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                placeholder="admin@example.com" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input type="password" value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                placeholder="••••••••" required />
            </div>
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loginLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              {loginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${
              toast.type === "error" ? "bg-red-500/90 text-white" : "bg-emerald-500/90 text-white"
            }`}>
            {toast.msg}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={fetchStats} title="Refresh"
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleLogout} title="Logout"
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-white">
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#111827] border-b border-white/5">
            {NAV_TABS.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id ? "text-white bg-white/5" : "text-gray-500"
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {loading && !stats ? (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : !stats ? (
          <div className="text-center py-24 text-gray-500">No data available</div>
        ) : (
          <AnimatePresence mode="wait">
            <Motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              {activeTab === "overview" && (
                <Overview stats={stats} onNavigate={setActiveTab} />
              )}
              {activeTab === "events" && (
                <EventsPage api={api} actionLoading={actionLoading}
                  onApprove={approveEvent} onReject={rejectEvent} onDelete={deleteEvent} />
              )}
              {activeTab === "planners" && (
                <AdminPlannerList api={api} actionLoading={actionLoading}
                  onVerify={verifyPlanner} onSuspend={suspendPlanner} onUnsuspend={unsuspend} />
              )}
              {activeTab === "withdrawals" && (
                <WithdrawalPage api={api} actionLoading={actionLoading}
                  onApprove={approveW} onReject={rejectW} onPaid={paidW}
                  refreshKey={withdrawalRefreshKey} />
              )}
              {activeTab === "logistics" && (
                <AdminLogistics api={api} refreshKey={0} />
              )}
              {activeTab === "users" && (
                <AdminUserList api={api} />
              )}

            </Motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}