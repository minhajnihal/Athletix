import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useOrdersByUser } from "../hooks/useOrder";
import { updateUser } from "../services/userService";
import { formatPrice } from "../utils/formatPrice";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateCurrentUser } = useAuth();
  const { cartCount, clearCart } = useCart();
  const { wishlist, clearWishlist } = useWishlist();

  const { data: orders = [], isLoading: ordersLoading } = useOrdersByUser(
    user?.email || user?.id
  );

  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    newPassword: "",
    confirmPassword: "",
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleStartEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.warning("Name and Email are required.");
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.warning("New password must be at least 6 characters.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    try {
      setIsSaving(true);

      const payload = {
        id: user.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      };

      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      // Update in JSON Server
      if (user.id) {
        await updateUser(payload);
      }

      // Update in Auth Context and LocalStorage
      updateCurrentUser(payload);

      toast.success("Profile and address updated successfully! ✓");
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearCart();
    clearWishlist();
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const displayOrders = [...orders].reverse().slice(0, 3);

  const hasAddress =
    user?.address?.street ||
    user?.address?.city ||
    user?.address?.pincode;

  return (
    <section className="min-h-[75vh] bg-black text-white px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header & Avatar Card - Aggressive Black & Red */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-zinc-950 to-red-950 p-8 text-white shadow-2xl border-2 border-red-600/60 shadow-red-950/40">
          <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600 text-3xl font-black text-white shadow-lg shadow-red-600/40 ring-2 ring-white/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                    {user?.name || "Athletix Athlete"}
                  </h1>
                  <span className="rounded-full bg-red-600/30 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-red-400 border border-red-500/50">
                    Pro Member
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-300 font-medium">
                  {user?.email || "No email specified"}
                </p>
                {user?.phone && (
                  <p className="mt-1 text-xs text-zinc-400 font-semibold">
                    Phone: {user.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false);
                  } else {
                    handleStartEdit();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:bg-white hover:text-black"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl border-2 border-red-600 bg-red-600/10 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-red-400 transition hover:bg-red-600 hover:text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            onClick={() => navigate("/orders")}
            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl transition hover:border-red-600"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Total Orders
              </p>
              <h3 className="mt-2 text-2xl font-black text-white group-hover:text-red-500 transition">
                {ordersLoading ? "..." : orders.length}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-red-500 border border-zinc-800 group-hover:bg-red-600 group-hover:text-white transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>

          <div
            onClick={() => navigate("/wishlist")}
            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl transition hover:border-red-600"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Wishlist Items
              </p>
              <h3 className="mt-2 text-2xl font-black text-white group-hover:text-red-500 transition">
                {wishlist.length}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-red-500 border border-zinc-800 group-hover:bg-red-600 group-hover:text-white transition">
              <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </span>
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl transition hover:border-red-600"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Cart Items
              </p>
              <h3 className="mt-2 text-2xl font-black text-white group-hover:text-red-500 transition">
                {cartCount}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-red-500 border border-zinc-800 group-hover:bg-red-600 group-hover:text-white transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Profile Details / Edit Form */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Personal Information & Saved Address
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Manage your athlete profile details and default delivery destination
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleStartEdit}
                className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-white transition"
              >
                Edit Details →
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-zinc-400">
                  Basic Info
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="border-t border-zinc-800 pt-5">
                <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-zinc-400">
                  Default Delivery Address
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      Street / House / Apartment
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="e.g. 123 Sports Avenue, Apt 4B"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Kozhikode"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Kerala"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      Pincode / Postal Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 673523"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="border-t border-zinc-800 pt-5">
                <h3 className="mb-1 text-sm font-black uppercase text-white">
                  Change Password
                </h3>
                <p className="mb-3 text-xs text-zinc-400 font-medium">
                  Leave blank to keep your current password
                </p>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:bg-white hover:text-black disabled:opacity-50"
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-zinc-700 bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Full Name
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {user?.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Email Address
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Phone Number
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Saved Delivery Address Display */}
              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-black uppercase tracking-wider text-white text-xs">
                      Saved Delivery Address
                    </h3>
                  </div>
                  <button
                    onClick={handleStartEdit}
                    className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-white transition"
                  >
                    {hasAddress ? "Change Address" : "+ Add Address"}
                  </button>
                </div>

                {hasAddress ? (
                  <div className="mt-3 text-sm text-zinc-300 font-medium">
                    {user?.address?.street && (
                      <p className="font-bold text-white">{user.address.street}</p>
                    )}
                    <p className="text-zinc-400">
                      {[user?.address?.city, user?.address?.state, user?.address?.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-zinc-400 font-medium">
                    No default delivery address saved yet. Save your address here for automatic prefill at checkout!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Recent Orders
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Track your recent equipment and tournament gear orders
              </p>
            </div>

            <Link
              to="/orders"
              className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-white transition"
            >
              View All Orders →
            </Link>
          </div>

          {ordersLoading ? (
            <p className="text-xs text-zinc-400 font-medium">Loading orders...</p>
          ) : displayOrders.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-red-500 border border-zinc-800">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-bold text-white">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/sports/all")}
                className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:bg-white hover:text-black"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayOrders.map((order) => {
                const status = (order.status || "Placed").toLowerCase();
                const badgeClass =
                  status === "cancelled"
                    ? "bg-red-600 text-white"
                    : status === "delivered"
                    ? "bg-emerald-600 text-white"
                    : "bg-red-600/30 border border-red-500/50 text-red-400";

                return (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-black p-4 transition hover:border-zinc-700"
                  >
                    <div>
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                        Order #{order.id}
                      </span>
                      <p className="text-sm font-black text-white">
                        {order.items?.length || 0} item(s) •{" "}
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-zinc-400 font-medium">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Recent"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider ${badgeClass}`}>
                        {order.status || "Placed"}
                      </span>
                      <button
                        onClick={() => navigate("/orders")}
                        className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-white transition"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Profile;
