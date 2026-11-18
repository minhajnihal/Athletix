import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { useOrdersByUser } from "../hooks/useOrder";
import { updateOrder } from "../services/orderService";

function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useOrdersByUser(user?.email || user?.id);

  const [cancellingId, setCancellingId] = useState(null);
  const displayOrders = [...orders].reverse();

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    try {
      setCancellingId(orderId);
      await updateOrder({
        id: orderId,
        status: "Cancelled",
      });
      toast.info(`Order #${orderId} was cancelled successfully.`);
      refetch();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "Placed").toLowerCase();
    if (s === "cancelled") {
      return (
        <span className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
          Cancelled
        </span>
      );
    }
    if (s === "delivered") {
      return (
        <span className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
          Delivered
        </span>
      );
    }
    return (
      <span className="rounded-full bg-red-600/30 border border-red-500/50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-400 shadow-sm">
        {status || "Placed"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-black">
        <p className="font-bold text-zinc-400">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-black">
        {error?.message || "Unable to load your orders."}
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <span className="text-xs font-black uppercase tracking-widest text-red-500">
            Order History
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-1 text-xs text-zinc-400 font-medium">
            Track, view receipt, or manage your placed equipment orders.
          </p>
        </div>

        {displayOrders.length === 0 ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-red-500 ring-2 ring-zinc-800">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-black uppercase text-white">
              No orders yet
            </h2>
            <p className="mt-1 text-sm text-zinc-400 max-w-sm font-medium">
              Your placed orders and package deliveries will appear here.
            </p>
            <button
              onClick={() => navigate("/sports/all")}
              className="mt-6 rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black shadow-lg shadow-red-600/30"
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayOrders.map((order) => {
              const isCancelled =
                (order.status || "").toLowerCase() === "cancelled";
              const isDelivered =
                (order.status || "").toLowerCase() === "delivered";
              const canCancel = !isCancelled && !isDelivered;

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl transition hover:border-zinc-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <p className="text-sm font-black text-white">
                        Order #{order.id}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400 font-medium">
                        Placed on{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recently"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="rounded-xl border border-red-600 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-red-500 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                        >
                          {cancellingId === order.id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 space-y-3">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={`${item.category}-${item.id}-${index}`}
                        className="flex items-center justify-between gap-4 py-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black border border-zinc-800">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || item.title}
                                className="h-full w-full object-cover filter contrast-110"
                              />
                            ) : (
                              <span className="text-zinc-600 text-xs font-bold">SPORTS</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-white line-clamp-1">
                              {item.name || item.title}
                            </p>
                            <p className="text-xs text-zinc-400 font-medium">
                              Qty: {item.quantity} • {item.category || "Gear"}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-black text-white">
                          ₹{(
                            Number(item.price) * Number(item.quantity)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-xs font-medium">
                    <div>
                      <p className="text-zinc-400">
                        Method: <span className="font-extrabold text-white">{order.paymentMethod || "COD"}</span>
                      </p>
                      {order.address && (
                        <p className="mt-0.5 text-zinc-400">
                          Ship to: {order.address.street || ""}, {order.address.city || ""} ({order.address.pincode || ""})
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 font-semibold">Total Paid: </span>
                      <span className="text-base font-black text-red-500">
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;
