import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../../services/admin/adminService";
import formatPrice from "../../utils/formatPrice";
import Loader from "../../components/Loader";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Placed");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getAdminOrderById(id);
        if (data) {
          setOrder(data);
          setStatus(data.status || "Placed");
        } else {
          toast.error("Order not found");
          navigate("/admin/orders");
        }
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("Failed to load order details");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      await updateAdminOrderStatus(id, newStatus);
      setStatus(newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
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

  if (!order) {
    return null;
  }

  const customerName =
    order.customer?.name || order.customerName || order.email || "Customer";
  const customerEmail = order.customer?.email || order.email || "Not specified";
  const customerPhone = order.customer?.phone || order.phone || "Not specified";
  const address = order.address || {};
  const items = Array.isArray(order.items) ? order.items : [];

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Not available";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link to="/admin/orders" className="hover:text-white transition">
              Orders
            </Link>
            <span>/</span>
            <span className="text-zinc-200">Order #{String(order.id).slice(0, 8)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Order #{String(order.id).slice(0, 8)}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Placed on {formattedDate}
          </p>
        </div>

        {/* Status Dropdown Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition"
          >
            ← Back to Orders
          </Link>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
            <span className="text-xs text-zinc-400 pl-2">Status:</span>
            <select
              value={status}
              disabled={isUpdating}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer capitalize ${getStatusBadge(
                status
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
        </div>
      </div>

      {/* 3 Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Customer Information */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Customer Details
          </div>

          <div className="space-y-1.5 text-sm">
            <p className="font-bold text-white text-base">{customerName}</p>
            <p className="text-zinc-400 text-xs flex items-center gap-2">
              <span className="text-zinc-500">Email:</span> {customerEmail}
            </p>
            <p className="text-zinc-400 text-xs flex items-center gap-2">
              <span className="text-zinc-500">Phone:</span> {customerPhone}
            </p>
            {order.userId && (
              <p className="text-zinc-500 font-mono text-[11px] pt-1">
                User ID: {order.userId}
              </p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Shipping Address
          </div>

          <div className="space-y-1 text-sm text-zinc-300">
            <p className="font-semibold text-white">
              {address.street || "No street address"}
            </p>
            <p className="text-xs text-zinc-400">
              {address.city ? `City: ${address.city}` : "City: Not provided"}
            </p>
            <p className="text-xs text-zinc-400">
              {address.pincode ? `Postal Code: ${address.pincode}` : "PIN: Not provided"}
            </p>
          </div>
        </div>

        {/* Payment & Order Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payment Info
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Payment Method:</span>
              <span className="font-semibold text-white">
                {order.paymentMethod || "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Fulfillment Status:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
              <span className="font-bold text-zinc-300">Total Charged:</span>
              <span className="text-xl font-black text-white">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Ordered Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Items in this Order</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {items.length} unique item{items.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 font-semibold">Item</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Audience</th>
                <th className="py-4 px-4 font-semibold text-center">Qty</th>
                <th className="py-4 px-4 font-semibold text-right">Price</th>
                <th className="py-4 px-6 font-semibold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {items.map((item, index) => {
                const qty = Number(item.quantity) || 1;
                const unitPrice = Number(item.price) || 0;
                const subtotal = qty * unitPrice;

                return (
                  <tr key={item.id || index} className="hover:bg-zinc-800/20">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/60 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/100x100/18181b/ffffff?text=Item";
                              }}
                            />
                          ) : (
                            <span className="text-xs text-zinc-500">No img</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white max-w-xs truncate">
                            {item.name || item.title}
                          </p>
                          <p className="text-xs text-zinc-500 truncate max-w-xs">
                            {item.description || `ID: #${item.id}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-semibold text-zinc-300 capitalize">
                        {item.category || "General"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs text-zinc-400 capitalize">
                        {item.audience || "Unspecified"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-semibold text-white">
                      {qty}
                    </td>

                    <td className="py-4 px-4 text-right font-semibold text-zinc-300">
                      {formatPrice(unitPrice)}
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-white text-base">
                      {formatPrice(subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-zinc-950/80 border-t border-zinc-800">
              <tr>
                <td colSpan={5} className="py-4 px-6 text-right font-bold text-zinc-300">
                  Total Order Amount:
                </td>
                <td className="py-4 px-6 text-right font-black text-white text-lg">
                  {formatPrice(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
