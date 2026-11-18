import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserByEmail, createUser } from "../services/userService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      const msg = "Please fill all required fields";
      setError(msg);
      toast.warning(msg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password.length < 6) {
      const msg = "Password must contain at least 6 characters";
      setError(msg);
      toast.warning(msg);
      return;
    }

    try {
      setIsSubmitting(true);

      const existingUser = await getUserByEmail(
        formData.email.trim().toLowerCase()
      );

      if (existingUser) {
        const msg = "Email is already registered";
        setError(msg);
        toast.error(msg);
        return;
      }

      const newUser = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      await createUser(newUser);
      toast.success("Registration successful! Please sign in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const msg = "Registration failed. Please try again.";
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
          Create Your Account
        </h2>

        <p className="mt-1 text-center text-xs text-zinc-400 font-medium">
          Join AthletiX for personalized athletic gear and orders
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-950/60 p-3 text-center text-xs font-bold text-red-400 border border-red-600/50">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
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
              placeholder="e.g. alex@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-300">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/30 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-black text-red-500 hover:text-white transition"
          >
            Sign In
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

export default Register;
