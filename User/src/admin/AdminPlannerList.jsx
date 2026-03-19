// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminPlannerList = () => {
//   const [planners, setPlanners] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     axios
//       .get("/api/admin/planners", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setPlanners(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleAction = async (id, action) => {
//     const token = localStorage.getItem("token");
//     await axios.patch(
//       `/api/admin/planners/${id}/${action}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } },
//     );
//     window.location.reload();
//   };

//   return (
//     <div>
//       <h1>Planner Management</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Verified</th>
//             <th>Suspended</th>
//             <th>Revenue</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {planners.map((planner) => (
//             <tr key={planner._id}>
//               <td>{planner.username}</td>
//               <td>{planner.email}</td>
//               <td>{planner.verified ? "Yes" : "No"}</td>
//               <td>{planner.suspended ? "Yes" : "No"}</td>
//               <td>{planner.revenue}</td>
//               <td>
//                 {!planner.verified && (
//                   <button onClick={() => handleAction(planner._id, "verify")}>
//                     Verify
//                   </button>
//                 )}
//                 {!planner.suspended && (
//                   <button onClick={() => handleAction(planner._id, "suspend")}>
//                     Suspend
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPlannerList;
// src/admin/AdminPlannerList.jsx
import React, { useEffect, useState } from "react";
import { BadgeCheck, ShieldOff, ShieldCheck } from "lucide-react";
import {
  fmt,
  fmtDate,
  SectionHeader,
  ActionBtn,
  LoadingSpinner,
} from "./adminUtils";

const AdminPlannerList = ({
  api,
  actionLoading,
  onVerify,
  onSuspend,
  onUnsuspend,
}) => {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/planners")
      .then((r) => {
        if (r.data.success) setPlanners(r.data.planners);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = planners.filter(
    (p) =>
      !search ||
      p.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.companyName?.toLowerCase().includes(search.toLowerCase()),
  );

  const PlannerStatus = ({ planner }) => {
    if (planner.isSuspended)
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-red-400 bg-red-400/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Suspended
        </span>
      );
    if (planner.isVerified)
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-400/10">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Verified
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-400 bg-gray-400/10">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Unverified
      </span>
    );
  };

  return (
    <div>
      <SectionHeader
        title="Planner Management"
        subtitle={`${planners.length} planners registered`}
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email or company…"
        className="w-full mb-6 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
      />

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
                    "Events",
                    "Revenue",
                    "Tickets Sold",
                    "Joined",
                    "Status",
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
                    <td
                      colSpan={7}
                      className="text-center py-12 text-gray-600"
                    >
                      No planners found
                    </td>
                  </tr>
                )}
                {filtered.map((planner) => (
                  <tr
                    key={planner._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Planner info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/${
                            planner.avatarStyle || "adventurer"
                          }/svg?seed=${planner.username}`}
                          className="w-9 h-9 rounded-full bg-white/5 flex-shrink-0"
                          alt={planner.username}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-white truncate">
                              {planner.username}
                            </p>
                            {planner.isVerified && (
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">
                            {planner.companyName || planner.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Events */}
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {planner.eventCount || 0} events
                    </td>

                    {/* Revenue */}
                    <td className="px-5 py-4 text-sm font-medium text-white">
                      {fmt(planner.revenue)}
                    </td>

                    {/* Tickets */}
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {(planner.ticketsSold || 0).toLocaleString()}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {fmtDate(planner.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <PlannerStatus planner={planner} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {!planner.isVerified && !planner.isSuspended && (
                          <ActionBtn
                            icon={BadgeCheck}
                            label="Verify"
                            variant="blue"
                            loading={
                              actionLoading[`pl-verify-${planner._id}`]
                            }
                            onClick={() => onVerify(planner._id)}
                          />
                        )}
                        {!planner.isSuspended ? (
                          <ActionBtn
                            icon={ShieldOff}
                            label="Suspend"
                            variant="danger"
                            loading={
                              actionLoading[`pl-suspend-${planner._id}`]
                            }
                            onClick={() => onSuspend(planner._id)}
                          />
                        ) : (
                          <ActionBtn
                            icon={ShieldCheck}
                            label="Unsuspend"
                            variant="success"
                            loading={
                              actionLoading[`pl-unsuspend-${planner._id}`]
                            }
                            onClick={() => onUnsuspend(planner._id)}
                          />
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

export default AdminPlannerList;