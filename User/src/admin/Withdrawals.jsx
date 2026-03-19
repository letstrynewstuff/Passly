

// src/admin/Withdrawal.jsx
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import {
  fmt,
  fmtDate,
  StatusBadge,
  SectionHeader,
  ActionBtn,
  LoadingSpinner,
} from "./adminUtils";

const WithdrawalPage = ({
  api,
  actionLoading,
  onApprove,
  onReject,
  onPaid,
  refreshKey, // ✅ increments every time a parent action completes → triggers re-fetch
}) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ✅ refreshKey in deps — re-fetches whenever admin approves / rejects / marks paid
  useEffect(() => {
    api
      .get("/admin/withdrawals")
      .then((r) => {
        if (r.data.success) setWithdrawals(r.data.withdrawals);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey, api]);

  const filtered = withdrawals.filter(
    (w) => filter === "all" || w.status === filter,
  );

  const totals = {
    pending: withdrawals
      .filter((w) => w.status === "pending")
      .reduce((s, w) => s + w.amount, 0),
    approved: withdrawals
      .filter((w) => w.status === "approved")
      .reduce((s, w) => s + w.amount, 0),
    paid: withdrawals
      .filter((w) => w.status === "paid")
      .reduce((s, w) => s + w.amount, 0),
  };

  const summaryCards = [
    {
      label: "Pending",
      value: totals.pending,
      color: "text-yellow-400",
      bg: "bg-yellow-400/5",
      border: "border-yellow-400/10",
    },
    {
      label: "Approved",
      value: totals.approved,
      color: "text-emerald-400",
      bg: "bg-emerald-400/5",
      border: "border-emerald-400/10",
    },
    {
      label: "Paid Out",
      value: totals.paid,
      color: "text-blue-400",
      bg: "bg-blue-400/5",
      border: "border-blue-400/10",
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Withdrawal Management"
        subtitle="Planner payout requests"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryCards.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}
          >
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-lg font-bold ${s.color} break-all`}>
              {fmt(s.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pending", "approved", "paid", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === s
                ? "bg-violet-500/20 text-violet-400"
                : "bg-white/5 text-gray-500 hover:text-gray-300"
            }`}
          >
            {s}
            {s !== "all" && (
              <span className="ml-1.5 text-gray-600">
                ({withdrawals.filter((w) => w.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Planner",
                    "Bank Details",
                    "Amount",
                    "Requested",
                    "Status",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`${i === 5 ? "text-right" : "text-left"} px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-600">
                      No withdrawals found
                    </td>
                  </tr>
                )}
                {filtered.map((w) => (
                  <tr
                    key={w._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Planner */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">
                        {w.plannerId?.companyName ||
                          w.plannerId?.username ||
                          "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {w.plannerId?.email}
                      </p>
                    </td>

                    {/* Bank details */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-300">{w.bankName}</p>
                      <p className="text-xs text-gray-500">
                        {w.accountNumber} · {w.accountName}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-white">
                        {fmt(w.amount)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {fmtDate(w.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={w.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {w.status === "pending" && (
                          <>
                            <ActionBtn
                              icon={CheckCircle}
                              label="Approve"
                              variant="success"
                              loading={actionLoading[`w-approve-${w._id}`]}
                              onClick={() => onApprove(w._id)}
                            />
                            <ActionBtn
                              icon={XCircle}
                              label="Reject"
                              variant="danger"
                              loading={actionLoading[`w-reject-${w._id}`]}
                              onClick={() => onReject(w._id)}
                            />
                          </>
                        )}
                        {w.status === "approved" && (
                          <ActionBtn
                            icon={CheckCircle}
                            label="Mark Paid"
                            variant="blue"
                            loading={actionLoading[`w-paid-${w._id}`]}
                            onClick={() => onPaid(w._id)}
                          />
                        )}
                        {(w.status === "paid" || w.status === "rejected") && (
                          <span className="text-xs text-gray-600">
                            {w.status === "paid" ? "Completed" : "Declined"} ·{" "}
                            {fmtDate(w.processedAt)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalPage;
