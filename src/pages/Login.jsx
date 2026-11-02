
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-amber-600 text-center">
          Welcome Back!
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Login to continue your shopping
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-green-600 font-bold">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;
