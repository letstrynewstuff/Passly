// src/admin/AdminUserList.jsx
import React, { useEffect, useState } from "react";
import { Users, RefreshCw } from "lucide-react";
import { fmtDate, SectionHeader, LoadingSpinner } from "./adminUtils";

const AdminUserList = ({ api }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/users")
      .then((r) => {
        if (r.data.success) setUsers(r.data.users);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <SectionHeader
        title="User Management"
        subtitle={`${users.length} registered users`}
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        className="w-full mb-6 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
      />

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["User", "Email", "Joined"].map((h, i) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.profileImage ||
                            `https://api.dicebear.com/7.x/${user.avatarStyle || "adventurer"}/svg?seed=${user.username}`
                          }
                          className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0"
                          alt={user.username}
                        />
                        <p className="text-sm font-medium text-white">
                          {user.username}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {user.email}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {fmtDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-600">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
