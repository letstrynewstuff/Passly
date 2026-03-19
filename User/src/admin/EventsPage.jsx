// src/admin/Event.jsx
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import {
  fmt,
  fmtDate,
  StatusBadge,
  SectionHeader,
  ActionBtn,
  LoadingSpinner,
} from "./adminUtils";

const EventsPage = ({ api, actionLoading, onApprove, onReject, onDelete }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/events")
      .then((r) => {
        if (r.data.success) setEvents(r.data.events);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.createdBy?.username?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <SectionHeader
        title="Event Management"
        subtitle={`${events.length} total events`}
      />

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events or planner…"
          className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((s) => (
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
            </button>
          ))}
        </div>
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
                    "Event",
                    "Planner",
                    "Tickets Sold",
                    "Revenue",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`${
                        i === 6 ? "text-right" : "text-left"
                      } px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-600">
                      No events found
                    </td>
                  </tr>
                )}
                {filtered.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Event */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {event.media?.[0] ? (
                          <img
                            src={event.media[0]}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate max-w-[180px]">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {event.location || "No location"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Planner */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">
                          {event.createdBy?.username || "—"}
                        </span>
                        {event.createdBy?.isVerified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      {event.createdBy?.companyName && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {event.createdBy.companyName}
                        </p>
                      )}
                    </td>

                    {/* Tickets sold */}
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {event.ticketsSold || 0}
                      {event.capacity > 0 && (
                        <span className="text-gray-600">/{event.capacity}</span>
                      )}
                    </td>

                    {/* Revenue */}
                    <td className="px-5 py-4 text-sm font-medium text-white">
                      {fmt(event.revenue)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={event.status} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {fmtDate(event.date)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {event.status !== "approved" && (
                          <ActionBtn
                            icon={CheckCircle}
                            label="Approve"
                            variant="success"
                            loading={actionLoading[`ev-approve-${event._id}`]}
                            onClick={() => onApprove(event._id)}
                          />
                        )}
                        {event.status !== "rejected" && (
                          <ActionBtn
                            icon={XCircle}
                            label="Reject"
                            variant="danger"
                            loading={actionLoading[`ev-reject-${event._id}`]}
                            onClick={() => onReject(event._id)}
                          />
                        )}
                        <ActionBtn
                          icon={Trash2}
                          label="Delete"
                          variant="danger"
                          loading={actionLoading[`ev-delete-${event._id}`]}
                          onClick={() => onDelete(event._id)}
                        />
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

export default EventsPage;
