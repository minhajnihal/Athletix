import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  if (!cart.length) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center bg-black px-6 text-center text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-red-500 ring-2 ring-zinc-800">
          <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-sm font-medium">
          Equip yourself with tournament-grade gear and athletic apparel to add to your arsenal.
        </p>
        <button
          onClick={() => navigate("/sports/all")}
          className="mt-6 rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black shadow-lg shadow-red-600/30"
        >
          Explore All Gear →
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-zinc-800 pb-4 mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-red-500">
            Selected Gear
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-xs text-zinc-400 font-medium">
            Review your battle gear before checking out
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={`${item.category}-${item.id}`}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl transition hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-black flex items-center justify-center border border-zinc-800">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || item.title}
                        className="h-full w-full object-cover filter contrast-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <span className="text-2xl text-zinc-600">📦</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
                      {item.category || "Sports"}
                    </span>
                    <h2 className="text-base font-extrabold text-white line-clamp-1">
                      {item.name || item.title}
                    </h2>
                    <p className="mt-1 font-black text-white">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 border-t border-zinc-800 pt-3 sm:border-0 sm:pt-0">
                  <div className="flex items-center rounded-lg border border-zinc-700 bg-black p-1">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.category)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800 text-sm font-black text-white shadow-sm transition hover:bg-zinc-700"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center text-xs font-black text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id, item.category)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800 text-sm font-black text-white shadow-sm transition hover:bg-zinc-700"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-black text-white min-w-20 text-right">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id, item.category)}
                    className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Order Summary Sidebar */}
          <div className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase tracking-tight text-white border-b border-zinc-800 pb-3">
              Order Summary
            </h3>

            <div className="mt-4 space-y-3 text-xs font-medium">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-black text-white">
                  ₹{Number(cartTotal).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Standard Delivery</span>
                <span className="font-black text-red-500">
                  {cartTotal >= 999 ? "FREE" : "₹99"}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-zinc-800" />

            <div className="flex justify-between text-base font-black text-white">
              <span>Estimated Total</span>
              <span className="text-lg text-red-500">
                ₹{(
                  Number(cartTotal) + (cartTotal >= 999 || cartTotal === 0 ? 0 : 99)
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/30 transition hover:bg-white hover:text-black"
            >
              Proceed to Checkout →
            </button>

            <button
              onClick={() => navigate("/sports/all")}
              className="mt-3 w-full text-center text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
