import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (product) => {
    if (isInCart(product.id, product.category)) return;
    addToCart(product);
    removeFromWishlist(product.id, product.category);
    toast.success(`${product.name || product.title} moved to cart! 🛒`);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id, product.category);
    toast.info(`Removed ${product.name || product.title} from wishlist`);
  };

  const handleClear = () => {
    clearWishlist();
    toast.info("Wishlist cleared");
  };

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Personal Arsenal
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              My Wishlist
            </h1>
            <p className="mt-1 text-xs text-zinc-400 font-medium">
              {wishlist.length} saved product(s) in your personal collection.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-xl border border-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-500 transition hover:bg-red-600 hover:text-white"
            >
              Clear All Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-red-500 ring-2 ring-zinc-800">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-black uppercase text-white">
              Your Wishlist is Empty
            </h2>
            <p className="mt-1 text-sm text-zinc-400 max-w-sm font-medium">
              Save your favourite sports kits, gear, and apparel here to purchase them later.
            </p>
            <button
              onClick={() => navigate("/sports/all")}
              className="mt-6 rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black shadow-lg shadow-red-600/30"
            >
              Browse Sports Catalog →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => {
              const alreadyInCart = isInCart(product.id, product.category);

              return (
                <article
                  key={`${product.category}-${product.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl transition hover:border-red-600"
                >
                  <div
                    onClick={() =>
                      navigate(
                        `/product/${product.category || "all"}/${product.id}`
                      )
                    }
                    className="relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || product.title}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105 filter contrast-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <span className="text-3xl text-zinc-600">🏅</span>
                    )}

                    <span className="absolute bottom-2 left-2 rounded-md bg-black/90 border border-zinc-700 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-400 shadow-sm">
                      {product.category || "Sports"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-1 flex-col justify-between">
                    <div>
                      <h2
                        onClick={() =>
                          navigate(
                            `/product/${product.category || "all"}/${product.id}`
                          )
                        }
                        className="cursor-pointer text-sm font-extrabold text-white line-clamp-1 hover:text-red-500 transition"
                      >
                        {product.name || product.title}
                      </h2>

                      <p className="mt-1 text-base font-black text-white">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={alreadyInCart}
                        className={`w-full rounded-xl py-2 text-xs font-black uppercase tracking-wider transition ${
                          alreadyInCart
                            ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                            : "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/30"
                        }`}
                      >
                        {alreadyInCart ? "In Cart" : "Move to Cart"}
                      </button>

                      <button
                        onClick={() => handleRemove(product)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-1.5 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-zinc-900 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;
