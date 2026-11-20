import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminProducts, getAdminOrders, getAdminUsers } from "../../services/admin/adminService";
import formatPrice from "../../utils/formatPrice";
import Loader from "../../components/Loader";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    usersCount: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: [],
    statusBreakdown: {
      Placed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    },
    categoryBreakdown: {},
  });

  const loadDashboardData = useCallback(async () => {
    try {
      const [productsData, ordersData, usersData] = await Promise.all([
        getAdminProducts().catch(() => []),
        getAdminOrders().catch(() => []),
        getAdminUsers().catch(() => []),
      ]);

      const products = Array.isArray(productsData) ? productsData : [];
      const orders = Array.isArray(ordersData) ? ordersData : [];
      const users = Array.isArray(usersData) ? usersData : [];

      // Calculate Total Revenue from non-cancelled orders
      const revenue = orders.reduce((acc, order) => {
        if (order.status !== "Cancelled") {
          return acc + (Number(order.total) || 0);
        }
        return acc;
      }, 0);

      // Order status breakdown
      const statusCounts = {
        Placed: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
      };

      orders.forEach((order) => {
        const s = order.status || "Placed";
        if (statusCounts[s] !== undefined) {
          statusCounts[s] += 1;
        } else {
          statusCounts[s] = 1;
        }
      });

      // Category breakdown
      const catCounts = {};
      products.forEach((p) => {
        const cat = p.category || "uncategorized";
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });

      // Recent 5 orders sorted by date
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      // Recent 5 users
      const recentUsers = [...users].slice(-5).reverse();

      setStats({
        productsCount: products.length,
        ordersCount: orders.length,
        usersCount: users.length,
        totalRevenue: revenue,
        recentOrders: sortedOrders.slice(0, 5),
        recentUsers,
        statusBreakdown: statusCounts,
        categoryBreakdown: catCounts,
      });
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      await loadDashboardData();
    };
    if (!ignore) {
      fetchInitial();
    }
    return () => {
      ignore = true;
    };
  }, [loadDashboardData]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadDashboardData();
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

  if (loading) {
    return (
      <div className="py-20">
        <Loader />
      </div>
    );
  }

  // Top 5 categories
  const topCategories = Object.entries(stats.categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time overview of your store performance, catalog & orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </Link>

          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatPrice(stats.totalRevenue)}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Excludes cancelled orders</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Orders
            </span>
            <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.ordersCount}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {stats.statusBreakdown.Placed || 0} pending fulfillment
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Products
            </span>
            <span className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.productsCount}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Across 16 sport categories</p>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Registered Users
            </span>
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.usersCount}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Active customer accounts</p>
          </div>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Placed", count: stats.statusBreakdown.Placed || 0, color: "text-amber-400", border: "border-amber-500/30" },
          { label: "Shipped", count: stats.statusBreakdown.Shipped || 0, color: "text-blue-400", border: "border-blue-500/30" },
          { label: "Delivered", count: stats.statusBreakdown.Delivered || 0, color: "text-emerald-400", border: "border-emerald-500/30" },
          { label: "Cancelled", count: stats.statusBreakdown.Cancelled || 0, color: "text-red-400", border: "border-red-500/30" },
        ].map((item) => (
          <div
            key={item.label}
            className={`bg-zinc-900/60 border ${item.border} rounded-xl p-4 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-zinc-400">{item.label} Orders</p>
              <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Orders & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-zinc-400">Latest customer purchases</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-red-500 hover:text-red-400 transition"
            >
              View All Orders →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No orders found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {stats.recentOrders.map((order) => {
                    const customerName =
                      order.customer?.name || order.customerName || order.email || "Customer";
                    const itemsCount =
                      Array.isArray(order.items)
                        ? order.items.reduce((s, i) => s + (i.quantity || 1), 0)
                        : 1;

                    return (
                      <tr key={order.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3.5 font-mono text-xs text-zinc-400">
                          #{String(order.id).slice(0, 8)}
                        </td>
                        <td className="py-3.5 font-medium text-white truncate max-w-[140px]">
                          {customerName}
                        </td>
                        <td className="py-3.5 text-xs text-zinc-400">
                          {itemsCount} item{itemsCount > 1 ? "s" : ""}
                        </td>
                        <td className="py-3.5 font-semibold text-white">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status || "Placed"}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex items-center text-xs text-red-500 hover:text-red-400 font-semibold"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Categories Breakdown (1 col) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Top Categories</h2>
              <Link
                to="/admin/products"
                className="text-xs font-semibold text-red-500 hover:text-red-400 transition"
              >
                View Catalog →
              </Link>
            </div>

            <div className="space-y-4">
              {topCategories.map(([category, count]) => {
                const percentage = Math.round(
                  (count / (stats.productsCount || 1)) * 100
                );

                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300 capitalize">{category}</span>
                      <span className="text-zinc-400">
                        {count} items ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-2 gap-3">
            <Link
              to="/admin/products"
              className="p-3 rounded-xl bg-zinc-800/70 hover:bg-zinc-800 text-center text-xs font-semibold text-zinc-300 hover:text-white transition"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/users"
              className="p-3 rounded-xl bg-zinc-800/70 hover:bg-zinc-800 text-center text-xs font-semibold text-zinc-300 hover:text-white transition"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
