import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { loginAdmin, clearAuthError } from "../../hooks/slice/authSlice";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "admin@athletix.com",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toast.warning("Please enter your admin credentials");
      return;
    }

    try {
      await dispatch(
        loginAdmin({
          email: formData.email.trim(),
          password: formData.password,
        })
      ).unwrap();

      toast.success("Welcome back to AthletiX Admin Panel!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error(err || "Admin authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 select-none mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-600/40">
              A
            </span>
            <h1 className="text-3xl font-black tracking-tight">
              <span className="text-white">ATHLETI</span>
              <span className="text-red-500">X</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase">
            Admin Control Center
          </p>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            Admin Sign In
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Sign in to manage catalog, orders, and registered athletes.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@athletix.com"
              autoComplete="username"
              required
              className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-lg px-4 py-3 pr-16 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-red-400 transition"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-xs flex items-center gap-2">
              <span className="font-bold">✕</span> {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-lg text-sm tracking-wide transition duration-200 shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In to Admin Portal"
            )}
          </button>
        </form>

        {/* Demo credentials helper card */}
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-400">
          <div className="font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Default Admin Credentials
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
            <div>
              <span className="text-zinc-500 block">Email:</span>
              <span className="text-zinc-200">admin@athletix.com</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Password:</span>
              <span className="text-zinc-200">Admin@123</span>
            </div>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-zinc-400 hover:text-red-400 transition inline-flex items-center gap-1"
          >
            ← Return to AthletiX Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
