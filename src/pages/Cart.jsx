import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow">
        <h1 className="text-2xl font-bold text-blue-600">
          AthletiX
        </h1>

        <button
          onClick={() => navigate("/")}
          className="font-medium hover:text-blue-600"
        >
          Home
        </button>
      </nav>

      <div className="p-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          Your Shopping Cart 🛒
        </h1>

        <p className="text-gray-600">
          Your cart is currently empty.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>

    </div>
  );
}

export default Cart;