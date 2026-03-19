// src/components/PlannerWithdrawal.jsx
import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  X,
  BadgeCheck,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import {
  getWithdrawalBalance,
  getMyWithdrawals,
  requestWithdrawal,
} from "../api/services/withdrawalApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => `₦${Number(v || 0).toLocaleString()}`;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Status config — "paid" shows as "Sent" on planner side
const STATUS = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    dot: "bg-yellow-400",
  },
  approved: {
    label: "Approved",
    icon: BadgeCheck,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
  },
  paid: {
    label: "Sent ✓",
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Withdraw Modal ───────────────────────────────────────────────────────────
const WithdrawModal = ({ available, isDark, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = confirm + password
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const input = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors border focus:ring-2 focus:ring-purple-500/20 ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500"
  }`;

  const label = `block text-sm font-medium mb-1.5 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const handleNext = () => {
    setError("");
    if (
      !form.amount ||
      !form.bankName ||
      !form.accountNumber ||
      !form.accountName
    ) {
      return setError("Please fill in all fields");
    }
    if (Number(form.amount) < 1000) {
      return setError("Minimum withdrawal is ₦1,000");
    }
    if (Number(form.amount) > available) {
      return setError(`Amount exceeds available balance of ${fmt(available)}`);
    }
    setStep(2);
  };

  // ✅ Uses requestWithdrawal from withdrawalApi — no direct API call
  const handleSubmit = async () => {
    setError("");
    if (!agreed)
      return setError("You must agree to the terms before proceeding");
    if (!password) return setError("Please enter your password to confirm");

    setLoading(true);
    try {
      const res = await requestWithdrawal({
        ...form,
        amount: Number(form.amount),
        password,
      });
      if (res.success) {
        onSuccess(res.withdrawal);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Request failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${
          isDark
            ? "bg-gray-900 border border-white/10"
            : "bg-white border border-gray-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {step === 1 ? "Withdraw Funds" : "Confirm Transfer"}
            </h3>
            <p
              className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Available:{" "}
              <span className="text-purple-500 font-semibold">
                {fmt(available)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-white/10 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? "bg-purple-600 text-white"
                    : isDark
                      ? "bg-gray-700 text-gray-500"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className={`flex-1 h-0.5 rounded transition-all ${
                    step > s
                      ? "bg-purple-600"
                      : isDark
                        ? "bg-gray-700"
                        : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Bank details form ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={label}>Amount (₦)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                className={input}
                placeholder="Minimum ₦1,000"
                min="1000"
                max={available}
              />
            </div>
            <div>
              <label className={label}>Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bankName: e.target.value }))
                }
                className={input}
                placeholder="e.g. First Bank, GTBank"
              />
            </div>
            <div>
              <label className={label}>Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, accountNumber: e.target.value }))
                }
                className={input}
                placeholder="10-digit account number"
                maxLength={10}
              />
            </div>
            <div>
              <label className={label}>Account Name</label>
              <input
                type="text"
                value={form.accountName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, accountName: e.target.value }))
                }
                className={input}
                placeholder="Name on the account"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold mt-2"
            >
              Continue
            </Motion.button>
          </div>
        )}

        {/* ── Step 2: Agreement + password ── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Summary card */}
            <div
              className={`rounded-xl p-4 space-y-2 text-sm ${
                isDark ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              {[
                { label: "Amount", value: fmt(form.amount), highlight: true },
                { label: "Bank", value: form.bankName },
                { label: "Account", value: form.accountNumber },
                { label: "Name", value: form.accountName },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                    {row.label}
                  </span>
                  <span
                    className={
                      row.highlight
                        ? "font-bold text-purple-500"
                        : isDark
                          ? "text-white"
                          : "text-gray-900"
                    }
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Agreement checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    agreed
                      ? "bg-purple-600 border-purple-600"
                      : isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-white"
                  }`}
                >
                  {agreed && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className={`text-sm leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                I authorize this transfer of{" "}
                <strong className="text-purple-500">{fmt(form.amount)}</strong>{" "}
                to <strong>{form.accountName}</strong> ({form.accountNumber},{" "}
                {form.bankName}). I confirm the details above are correct and
                understand this action cannot be undone once processed.
              </span>
            </label>

            {/* Password confirmation */}
            <div>
              <label className={label}>Confirm with your password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${input} pr-12`}
                  placeholder="Enter your account password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {showPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                  isDark
                    ? "border-gray-700 text-gray-300 hover:bg-white/5"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Back
              </button>
              <Motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Request
                  </>
                )}
              </Motion.button>
            </div>
          </div>
        )}
      </Motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PlannerWithdrawal = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [balance, setBalance] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ Uses getWithdrawalBalance from withdrawalApi — no direct API call
  const fetchBalance = async () => {
    try {
      const res = await getWithdrawalBalance();
      if (res.success) setBalance(res.balance);
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  // ✅ Uses getMyWithdrawals from withdrawalApi — no direct API call
  const fetchHistory = async () => {
    try {
      const res = await getMyWithdrawals();
      if (res.success) setWithdrawals(res.withdrawals);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  const handleSuccess = (newWithdrawal) => {
    setShowModal(false);
    setWithdrawals((prev) => [newWithdrawal, ...prev]);
    fetchBalance(); // refresh balance so available amount updates
    setSuccessMsg(
      "Withdrawal request submitted! Admin will review and process it.",
    );
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const card = `rounded-2xl p-6 shadow-lg ${
    isDark
      ? "bg-gray-800 border border-gray-700/50"
      : "bg-white border border-gray-100"
  }`;
  const text = isDark ? "text-white" : "text-gray-900";
  const muted = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl px-4 py-3 text-sm font-medium"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ── Balance card ── */}
      <div className={card}>
        <h2 className={`text-xl font-bold mb-6 ${text}`}>
          Wallet & Withdrawals
        </h2>

        {loadingBalance ? (
          <div className="flex justify-center py-8">
            <Loader2
              className={`w-6 h-6 animate-spin ${
                isDark ? "text-purple-400" : "text-purple-500"
              }`}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Available balance hero */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-2xl p-6 text-center">
              <p className={`text-sm mb-2 ${muted}`}>Available Balance</p>
              <p className="text-4xl font-bold text-purple-400">
                {fmt(balance?.available)}
              </p>
              <p className={`text-xs mt-2 ${muted}`}>
                Gross revenue {fmt(balance?.grossRevenue)} — Paid out{" "}
                {fmt(balance?.totalPaidOut)}
                {balance?.inProgress > 0 &&
                  ` — In progress ${fmt(balance?.inProgress)}`}
              </p>
            </div>

            {/* Mini stat row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Gross Earned",
                  value: fmt(balance?.grossRevenue),
                  color: "text-purple-400",
                },
                {
                  label: "Total Paid Out",
                  value: fmt(balance?.totalPaidOut),
                  color: "text-emerald-400",
                },
                {
                  label: "In Progress",
                  value: fmt(balance?.inProgress),
                  color: "text-yellow-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl p-3 text-center ${
                    isDark ? "bg-white/5" : "bg-gray-50"
                  }`}
                >
                  <p className={`text-xs ${muted} mb-1`}>{s.label}</p>
                  <p className={`text-sm font-bold ${s.color} break-all`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Withdraw button */}
            <Motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowModal(true)}
              disabled={(balance?.available || 0) < 1000}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all ${
                (balance?.available || 0) >= 1000
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110"
                  : "bg-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              <ArrowDownLeft className="w-5 h-5" />
              {(balance?.available || 0) >= 1000
                ? "Withdraw Funds"
                : "Minimum balance ₦1,000 required"}
            </Motion.button>
          </div>
        )}
      </div>

      {/* ── Transaction history ── */}
      <div className={card}>
        <h3 className={`text-lg font-bold mb-5 ${text}`}>
          Transaction History
        </h3>

        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <Loader2
              className={`w-6 h-6 animate-spin ${
                isDark ? "text-purple-400" : "text-purple-500"
              }`}
            />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className={`text-center py-10 ${muted}`}>
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No withdrawal requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <Motion.div
                key={w._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isDark
                    ? "bg-white/[0.03] hover:bg-white/[0.06]"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {/* Status icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    w.status === "paid"
                      ? "bg-emerald-500/10"
                      : w.status === "rejected"
                        ? "bg-red-500/10"
                        : w.status === "approved"
                          ? "bg-blue-500/10"
                          : "bg-yellow-500/10"
                  }`}
                >
                  {w.status === "paid" && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                  {w.status === "rejected" && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  {w.status === "approved" && (
                    <BadgeCheck className="w-5 h-5 text-blue-400" />
                  )}
                  {w.status === "pending" && (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className={`text-sm font-semibold ${text}`}>
                      {fmt(w.amount)}
                    </p>
                    <StatusBadge status={w.status} />
                  </div>
                  <p className={`text-xs truncate ${muted}`}>
                    {w.bankName} · {w.accountNumber} · {w.accountName}
                  </p>
                  {w.note && (
                    <p className="text-xs text-red-400 mt-0.5">
                      Note: {w.note}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs ${muted}`}>{fmtDate(w.createdAt)}</p>
                  {w.processedAt && (
                    <p className={`text-xs ${muted} mt-0.5`}>
                      {w.status === "paid" ? "Sent" : "Processed"}:{" "}
                      {fmtDate(w.processedAt)}
                    </p>
                  )}
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Withdraw Modal ── */}
      <AnimatePresence>
        {showModal && (
          <WithdrawModal
            available={balance?.available || 0}
            isDark={isDark}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default PlannerWithdrawal;
