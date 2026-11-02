
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const placeholders = [
    'Search for "Fishing Rods"',
    'Search for "Cricket Bat"',
    'Search for "Cycles"',
    'Search for "Hicking Backpack"',
    'Search for "Football"',
    'Search for "Yoga Mats"',
    'Search for "Kayaks"',
    'Search for "Running Shoes"',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex items-center justify-between gap-6 bg-white px-8 py-4 shadow-md">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="cursor-pointer text-3xl font-bold text-blue-600"
      >
        AthletiX
      </h1>

      {/* Home and Categories */}
      <div className="flex items-center gap-5">
        <button onClick={() => navigate("/")} className="font-medium hover:text-blue-600">
          Home
        </button>

        <button className="font-medium hover:text-blue-600">
          Categories
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-1 max-w-2xl items-center gap-3 rounded-xl border border-gray-300 px-5 py-3">
        <span className="text-xl text-gray-500">🔍</span>

        <input
          type="text"
          placeholder={placeholders[index]}
          className="w-full outline-none"
        />
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-5">

        <button onClick={() => navigate("/login")} className="font-medium hover:text-blue-600">
          Login
        </button>

        <button onClick={() => navigate("/wishlist")} className="text-xl">
          ❤️
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          🛒 Cart
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
