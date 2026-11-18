import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useProductById } from "../hooks/useProduct";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProductById(id);

  const { addToCart, isInCart } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const alreadyInCart = product
    ? isInCart(product.id, product.category || category)
    : false;

  const productInWishlist = product
    ? isInWishlist(product.id, product.category || category)
    : false;

  const handleAddToCart = () => {
    if (!product || alreadyInCart) return;

    addToCart({
      ...product,
      category: product.category || category,
    });

    toast.success("Product added to cart! 🛒");
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!alreadyInCart) {
      addToCart({
        ...product,
        category: product.category || category,
      });
    }

    navigate("/checkout");
  };

  const handleWishlist = () => {
    if (!product) return;

    if (productInWishlist) {
      removeFromWishlist(product.id, product.category || category);
      toast.info("Removed from Wishlist");
    } else {
      addToWishlist({
        ...product,
        category: product.category || category,
      });
      toast.info("Added to Wishlist! ♡");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-black">
        <p className="font-bold text-zinc-300">Loading product...</p>
      </div>
    );
  }

  if (
    isError ||
    !product ||
    (category &&
      category.toLowerCase() !== "all" &&
      product.category &&
      product.category.toLowerCase() !== category.toLowerCase())
  ) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-black">
        <h1 className="text-2xl font-black uppercase text-white">
          Product Not Found
        </h1>
        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-xl bg-red-600 px-7 py-3 font-black uppercase tracking-wider text-white shadow-md hover:bg-white hover:text-black transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => {
            if (category?.toLowerCase() === "all") {
              navigate("/sports/all");
            } else {
              navigate(`/category/${category}`);
            }
          }}
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 hover:text-white transition"
        >
          ← Back to Products
        </button>

        <div className="grid gap-10 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl md:grid-cols-2 md:p-10">
          {/* Product Media */}
          <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-2xl bg-black ring-1 ring-zinc-800">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name || product.title}
                className="max-h-[440px] w-full rounded-2xl object-cover shadow-sm transition duration-500 hover:scale-105 filter contrast-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="rounded-md bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                {product.category || category}
              </span>

              <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                {product.name || product.title}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-3xl font-black text-white">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
                <span className="text-xs font-bold text-red-500">Inclusive of all taxes</span>
              </div>

              <div className="my-6 border-t border-zinc-800 pt-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  Description
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 font-medium">
                  {product.description || "Certified pro-grade athletic equipment crafted for maximum endurance and performance."}
                </p>
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2 rounded-xl bg-black p-2.5 border border-zinc-800">
                  <span className="text-red-500 font-black">🛡️</span>
                  <span className="font-extrabold">100% Genuine</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-black p-2.5 border border-zinc-800">
                  <span className="text-red-500 font-black">🔄</span>
                  <span className="font-extrabold">30-Day Returns</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-zinc-800">
              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-xl bg-white px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:bg-red-600 hover:text-white"
              >
                Buy Now
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={alreadyInCart}
                className={`flex-1 rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition ${
                  alreadyInCart
                    ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                    : "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/30"
                }`}
              >
                {alreadyInCart ? "In Cart" : "Add to Cart"}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`flex items-center justify-center rounded-xl border-2 px-4 py-3.5 text-xs font-bold transition ${
                  productInWishlist
                    ? "border-red-600 bg-red-600/20 text-red-500"
                    : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-red-500 hover:text-red-500"
                }`}
                title={productInWishlist ? "In Wishlist" : "Add to Wishlist"}
              >
                <svg
                  className="h-4 w-4"
                  fill={productInWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* View Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-300 hover:border-white hover:text-white transition"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
