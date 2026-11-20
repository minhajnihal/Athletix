import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminOrders, updateAdminOrderStatus } from "../../services/admin/adminService";
import formatPrice from "../../utils/formatPrice";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

const STATUS_OPTIONS = ["All", "Placed", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Status updating map: { [orderId]: boolean }
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      await loadOrders();
    };
    if (!ignore) {
      fetchInitial();
    }
    return () => {
      ignore = true;
    };
  }, [loadOrders]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadOrders();
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateAdminOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((ord) =>
          String(ord.id) === String(orderId) ? { ...ord, status: newStatus } : ord
        )
      );

      toast.success(`Order #${String(orderId).slice(0, 8)} updated to "${newStatus}"`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Placed":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((ord) => {
        const idMatch = String(ord.id || "").toLowerCase().includes(q);
        const nameMatch = (ord.customer?.name || ord.customerName || "")
          .toLowerCase()
          .includes(q);
        const emailMatch = (ord.customer?.email || ord.email || "")
          .toLowerCase()
          .includes(q);
        const cityMatch = (ord.address?.city || "").toLowerCase().includes(q);

        return idMatch || nameMatch || emailMatch || cityMatch;
      });
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter(
        (ord) => (ord.status || "Placed").toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    return result;
  }, [orders, search, selectedStatus]);

  // Paginated slice
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Orders Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track customer shipments, payments, and update fulfillment status ({orders.length} orders total)
          </p>
        </div>

        <button
          onClick={handleRefresh}
          title="Refresh orders"
          className="p-2.5 self-start sm:self-auto rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-2 text-xs font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search & Status Tabs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {STATUS_OPTIONS.map((status) => {
              const isActive = selectedStatus === status;
              const count =
                status === "All"
                  ? orders.length
                  : orders.filter(
                      (o) => (o.status || "Placed").toLowerCase() === status.toLowerCase()
                    ).length;

              return (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span>{status}</span>
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

          {/* Search Bar */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by ID, customer, email..."
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
      </div>

      {/* Orders Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">No orders found</h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-sm mx-auto">
              No orders matched your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Order</th>
                  <th className="py-4 px-4 font-semibold">Customer</th>
                  <th className="py-4 px-4 font-semibold">Date</th>
                  <th className="py-4 px-4 font-semibold">Items</th>
                  <th className="py-4 px-4 font-semibold">Total</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {paginatedOrders.map((order) => {
                  const customerName =
                    order.customer?.name || order.customerName || "Customer";
                  const customerEmail =
                    order.customer?.email || order.email || "No email";
                  const itemsCount = Array.isArray(order.items)
                    ? order.items.reduce((s, i) => s + (i.quantity || 1), 0)
                    : 1;

                  const orderDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-800/30 transition group"
                    >
                      {/* Order ID */}
                      <td className="py-4 px-6">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-mono text-xs font-bold text-red-500 hover:text-red-400 underline"
                        >
                          #{String(order.id).slice(0, 8)}
                        </Link>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {order.paymentMethod || "COD"}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-white truncate max-w-[150px]">
                          {customerName}
                        </p>
                        <p className="text-xs text-zinc-400 truncate max-w-[150px]">
                          {customerEmail}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-zinc-400 whitespace-nowrap">
                        {orderDate}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 text-xs text-zinc-300">
                        <span className="font-semibold text-white">
                          {itemsCount}
                        </span>{" "}
                        item{itemsCount > 1 ? "s" : ""}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-bold text-white text-base">
                        {formatPrice(order.total)}
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status || "Placed"}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`px-3 py-1 text-xs font-bold rounded-lg border outline-none cursor-pointer capitalize transition ${getStatusBadge(
                              order.status
                            )} disabled:opacity-50`}
                          >
                            <option value="Placed" className="bg-zinc-900 text-amber-400">
                              Placed
                            </option>
                            <option value="Shipped" className="bg-zinc-900 text-blue-400">
                              Shipped
                            </option>
                            <option value="Delivered" className="bg-zinc-900 text-emerald-400">
                              Delivered
                            </option>
                            <option value="Cancelled" className="bg-zinc-900 text-red-400">
                              Cancelled
                            </option>
                          </select>
                        </div>
                      </td>

                      {/* Details link */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition inline-flex items-center gap-1"
                        >
                          View
                          <span className="text-[10px]">→</span>
                        </Link>
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
    </div>
  );
}

export default AdminOrders;
