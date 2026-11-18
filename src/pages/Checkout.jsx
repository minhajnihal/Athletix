import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import useOrder from "../hooks/useOrder";
import { updateUser } from "../services/userService";
import { getUserOrders } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const { cart, cartTotal, clearCart } = useCart();
  const { user, updateCurrentUser } = useAuth();
  const { addOrder, isAdding } = useOrder();

  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    pincode: user?.address?.pincode || "",
    paymentMethod: "Cash on Delivery",
  }));

  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isPrefilled, setIsPrefilled] = useState(
    Boolean(user?.address?.street || user?.address?.city)
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Prefetch address from previous orders if profile address is not set
  useEffect(() => {
    if (!user?.address?.street && (user?.email || user?.id)) {
      getUserOrders(user?.email || user?.id)
        .then((orders) => {
          if (orders && orders.length > 0) {
            const lastOrder = orders[orders.length - 1];
            if (lastOrder?.address) {
              setFormData((prev) => ({
                ...prev,
                address: prev.address || lastOrder.address.street || "",
                city: prev.city || lastOrder.address.city || "",
                pincode: prev.pincode || lastOrder.address.pincode || "",
                phone: prev.phone || lastOrder.customer?.phone || "",
              }));
              setIsPrefilled(true);
            }
          }
        })
        .catch((err) => console.error("Error prefetching past address:", err));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!cart.length) {
      const msg = "Your cart is empty.";
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    if (!user?.email) {
      const msg = "Please log in before placing an order.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      // Place the order
      await addOrder({
        userId: user.id || user.email,
        email: user.email,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        address: {
          street: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        items: cart,
        total: Number(cartTotal),
        paymentMethod: formData.paymentMethod,
        status: "Placed",
        createdAt: new Date().toISOString(),
      });

      // Save address to user profile if selected
      if (saveToProfile && user?.id) {
        try {
          const updatedAddress = {
            street: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          };
          await updateUser({
            id: user.id,
            phone: formData.phone || user.phone,
            address: {
              ...(user.address || {}),
              ...updatedAddress,
            },
          });
          updateCurrentUser({
            phone: formData.phone || user.phone,
            address: {
              ...(user.address || {}),
              ...updatedAddress,
            },
          });
        } catch (err) {
          console.warn("Could not auto-save address to profile:", err);
        }
      }

      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders", { replace: true });
    } catch (error) {
      const msg = error?.message || "Unable to place your order. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  if (!cart.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-black px-4 text-center text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-red-500 ring-2 ring-zinc-800">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-black uppercase text-white">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-zinc-400 font-medium">
          Add sports equipment to your cart to proceed with checkout.
        </p>
        <button
          onClick={() => navigate("/sports/all")}
          className="mt-6 rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:bg-white hover:text-black"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-red-500">
            Secure Order
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Checkout
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl lg:col-span-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-lg font-black uppercase text-white">
                  Delivery Information
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  Where should we deliver your tournament-grade gear?
                </p>
              </div>

              {isPrefilled && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600/20 px-3 py-1 text-xs font-bold text-red-400">
                  <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Prefilled from profile
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-zinc-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-zinc-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="rahul@example.com"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-zinc-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-zinc-300">
                  Street / Building / Area *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Flat / House No., Colony, Landmark"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-zinc-300">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Kozhikode"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-zinc-300">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 673523"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-black p-3.5">
              <input
                type="checkbox"
                id="saveAddressCheckbox"
                checked={saveToProfile}
                onChange={(e) => setSaveToProfile(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500"
              />
              <label
                htmlFor="saveAddressCheckbox"
                className="cursor-pointer text-xs font-bold text-zinc-300"
              >
                Save this delivery address to my Athletix profile for 1-click checkout next time
              </label>
            </div>

            <div className="border-t border-zinc-800 pt-5">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-zinc-300">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
              >
                <option>Cash on Delivery</option>
                <option>Online Payment</option>
              </select>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-red-950/60 p-3.5 text-xs font-bold text-red-400 border border-red-600/50">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAdding}
              className="w-full rounded-xl bg-red-600 py-3.5 font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/30 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? "Placing Your Order..." : "Confirm & Place Order"}
            </button>
          </form>

          {/* Order Summary Aside */}
          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl">
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              Order Summary
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400 font-medium">
              {cart.length} item(s) in cart
            </p>

            <div className="mt-5 divide-y divide-zinc-800">
              {cart.map((item) => (
                <div
                  key={`${item.category}-${item.id}`}
                  className="flex justify-between gap-3 py-3 text-xs"
                >
                  <span className="font-bold text-zinc-300 line-clamp-1">
                    {item.name || item.title} <span className="text-zinc-500 font-normal">× {item.quantity}</span>
                  </span>
                  <span className="flex-shrink-0 font-black text-white">
                    ₹{(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-zinc-800" />

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="font-black text-red-500">FREE</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Standard Handling</span>
                <span className="font-bold text-white">₹0</span>
              </div>
            </div>

            <div className="my-4 border-t border-zinc-800" />

            <div className="flex items-center justify-between text-base font-black text-white">
              <span>Total Payable</span>
              <span className="text-xl text-red-500">₹{Number(cartTotal).toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-black p-3 text-[11px] text-zinc-400 border border-zinc-800">
              <svg className="h-4 w-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Safe & encrypted checkout. 30-day money back guarantee.</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
