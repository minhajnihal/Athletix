import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const placeholders = [
  'Search for "Cricket Bat"',
  'Search for "Football Boots"',
  'Search for "Road Cycles"',
  'Search for "Trekking Backpack"',
  'Search for "Gym Dumbbells"',
  'Search for "Badminton Racket"',
  'Search for "Running Shoes"',
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount, clearCart } = useCart();
  const { wishlistCount, clearWishlist } = useWishlist();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [search, setSearch] = useState("");

  // Animated search placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/category/${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    clearCart();
    clearWishlist();
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const navCategories = [
    { label: "Home", path: "/" },
    { label: "All Sports", path: "/sports/all" },
    { label: "Men", path: "/sports/men" },
    { label: "Women", path: "/sports/women" },
    { label: "Kids", path: "/sports/kids" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      {/* Top Navbar */}
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

        {/* Brand Logo - Aggressive Red & Black */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 select-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-600/40 ring-1 ring-red-500">
            <span className="text-white text-lg">A</span>
          </span>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-white">ATHLETI</span>
            <span className="text-red-500">X</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="group relative flex flex-1 max-w-xl items-center"
        >
          <div className="pointer-events-none absolute left-4 text-zinc-500 group-focus-within:text-red-500 transition">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900 py-2.5 pl-11 pr-24 text-sm text-white placeholder-zinc-500 transition focus:border-red-600 focus:bg-black focus:outline-none focus:ring-4 focus:ring-red-500/20"
          />

          <button
            type="submit"
            className="absolute right-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase text-white transition hover:bg-white hover:text-black shadow-md shadow-red-600/20"
          >
            Search
          </button>
        </form>

        {/* User Navigation Links */}
        <div className="flex items-center gap-3 text-sm font-medium text-zinc-300 sm:gap-5">

          {/* User Account / Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-zinc-900 hover:text-red-500"
              title={isLoggedIn ? "View Profile" : "Sign In to AthletiX"}
            >
              {isLoggedIn ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white shadow-md shadow-red-600/40">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              ) : (
                <svg
                  className="h-5 w-5 text-zinc-300 hover:text-red-500 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}

              <span className="hidden text-xs font-bold text-white sm:inline">
                {isLoggedIn ? `Hi, ${user?.name?.split(" ")[0] || "User"}` : "Sign In"}
              </span>
            </button>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-400 hover:underline"
                title="Logout"
              >
                Logout
              </button>
            )}
          </div>

          {/* Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition hover:bg-zinc-900 hover:text-red-500"
            title="My Orders"
          >
            <svg
              className="h-5 w-5 text-zinc-300 hover:text-red-500 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="hidden text-xs font-bold text-zinc-200 md:inline">Orders</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative flex items-center gap-1.5 rounded-lg p-2 transition hover:bg-zinc-900 hover:text-red-500"
            title="My Wishlist"
          >
            <svg
              className="h-5 w-5 text-zinc-300 hover:text-red-500 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-md shadow-red-600/40">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-1.5 rounded-lg p-2 transition hover:bg-zinc-900 hover:text-red-500"
            title="Shopping Cart"
          >
            <svg
              className="h-5 w-5 text-zinc-300 hover:text-red-500 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-md shadow-red-600/40">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Sub-Navigation Categories Bar */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
          {navCategories.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`whitespace-nowrap text-xs font-black tracking-wider uppercase transition ${
                  isActive
                    ? "text-red-500 border-b-2 border-red-500 pb-0.5"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
