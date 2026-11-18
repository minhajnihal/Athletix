import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getUserByEmail } from "../services/userService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      const msg = "Please enter email and password";
      setError(msg);
      toast.warning(msg);
      return;
    }

    try {
      setIsSubmitting(true);

      const loggedInUser = await getUserByEmail(
        email.trim().toLowerCase()
      );

      if (!loggedInUser || loggedInUser.password !== password) {
        const msg = "Invalid email or password";
        setError(msg);
        toast.error(msg);
        return;
      }

      const userData = {
        id: loggedInUser.id || loggedInUser.email,
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        address: loggedInUser.address || null,
      };

      login(userData);
      toast.success(`Welcome back, ${loggedInUser.name}!`);

      const targetPath = location.state?.from?.pathname || "/";
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const msg = "Login failed. Please check your backend connection and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-black px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-red-950/20">

        {/* Brand Logo - Aggressive Red & Black */}
        <div
          onClick={() => navigate("/")}
          className="mb-6 flex cursor-pointer items-center justify-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-600/40 ring-1 ring-red-500">
            <span className="text-white text-lg">A</span>
          </span>
          <span className="text-2xl font-black text-white tracking-tight">
            ATHLETI<span className="text-red-500">X</span>
          </span>
        </div>

        <h2 className="text-center text-xl font-black uppercase tracking-tight text-white">
          Sign In to Your Account
        </h2>

        <p className="mt-1 text-center text-xs text-zinc-400 font-medium">
          Enter your details below to access your orders and gear
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-950/60 p-3 text-center text-xs font-bold text-red-400 border border-red-600/50">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/30 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-black text-red-500 hover:text-white transition"
          >
            Create an Account
          </Link>
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full text-center text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-white"
        >
          ← Return to Home
        </button>

      </div>
    </div>
  );
}

export default Login;
