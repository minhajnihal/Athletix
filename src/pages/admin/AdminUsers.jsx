import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { getAdminUsers, toggleBlockUser } from "../../services/admin/adminService";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // User action modal
  const [userToToggle, setUserToToggle] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load registered users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      await loadUsers();
    };
    if (!ignore) {
      fetchInitial();
    }
    return () => {
      ignore = true;
    };
  }, [loadUsers]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadUsers();
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleConfirmToggle = async () => {
    if (!userToToggle) return;

    const newBlockedState = !userToToggle.isBlocked;
    const actionLabel = newBlockedState ? "blocked" : "unblocked";

    try {
      setIsUpdating(true);
      await toggleBlockUser(userToToggle.id, newBlockedState);

      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(userToToggle.id)
            ? { ...u, isBlocked: newBlockedState }
            : u
        )
      );

      toast.success(`User ${userToToggle.name || userToToggle.email} has been ${actionLabel}`);
      setUserToToggle(null);
    } catch (error) {
      console.error("Error toggling user block status:", error);
      toast.error(`Failed to ${actionLabel} user`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q)) ||
          (u.address?.city && u.address.city.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((u) => !u.isBlocked);
    } else if (statusFilter === "blocked") {
      result = result.filter((u) => u.isBlocked);
    }

    return result;
  }, [users, search, statusFilter]);

  // Paginated slice
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Monitor registered athletes and manage account access ({users.length} accounts total)
          </p>
        </div>

        <button
          onClick={handleRefresh}
          title="Refresh users"
          className="p-2.5 self-start sm:self-auto rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-2 text-xs font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {["all", "active", "blocked"].map((type) => {
            const isActive = statusFilter === type;
            const count =
              type === "all"
                ? users.length
                : type === "active"
                ? users.filter((u) => !u.isBlocked).length
                : users.filter((u) => u.isBlocked).length;

            return (
              <button
                key={type}
                onClick={() => handleStatusFilterChange(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span>{type}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <svg
            className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">No users found</h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-sm mx-auto">
              No registered user accounts match your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-4 font-semibold">Email</th>
                  <th className="py-4 px-4 font-semibold">Phone</th>
                  <th className="py-4 px-4 font-semibold">Location</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {paginatedUsers.map((user) => {
                  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();
                  const isBlocked = Boolean(user.isBlocked);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-800/30 transition group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {user.name || "Nameless User"}
                            </p>
                            <p className="text-[11px] text-zinc-500 font-mono">
                              ID: {String(user.id).slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-xs font-mono text-zinc-300">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-xs text-zinc-300">
                        {user.phone || "Not provided"}
                      </td>

                      {/* Location / City */}
                      <td className="py-4 px-4 text-xs text-zinc-400 capitalize">
                        {user.address?.city || user.address?.street || "Not specified"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Block / Unblock Toggle Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setUserToToggle(user)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                            isBlocked
                              ? "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/30 shadow-emerald-500/20"
                              : "bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30 shadow-red-500/20"
                          }`}
                        >
                          {isBlocked ? "Unblock Account" : "Block Account"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(val) => setItemsPerPage(val)}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userToToggle.isBlocked
                  ? "bg-emerald-600/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-600/10 border border-red-500/20 text-red-400"
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {userToToggle.isBlocked ? "Unblock User" : "Block User"}
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Are you sure you want to{" "}
                <span className="font-semibold text-white">
                  {userToToggle.isBlocked ? "restore access for" : "restrict access for"}
                </span>{" "}
                <span className="text-white font-bold">
                  "{userToToggle.name || userToToggle.email}"
                </span>
                ?{" "}
                {userToToggle.isBlocked
                  ? "This user will regain ability to sign in and place orders."
                  : "This user will be prevented from logging into their account."}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setUserToToggle(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleConfirmToggle}
                className={`px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg transition disabled:opacity-50 ${
                  userToToggle.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                }`}
              >
                {isUpdating
                  ? "Processing..."
                  : userToToggle.isBlocked
                  ? "Yes, Unblock"
                  : "Yes, Block Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
