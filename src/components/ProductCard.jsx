import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const alreadyInCart = isInCart(product.id, product.category);
  const inWishlist = isInWishlist(product.id, product.category);

  // Add product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (alreadyInCart) return;

    addToCart(product);
    toast.success(`${product.name || product.title} added to cart! 🛒`);
  };

  // Toggle wishlist
  const handleToggleWishlist = (e) => {
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id, product.category);
      toast.info(`Removed ${product.name || product.title} from Wishlist`);
    } else {
      addToWishlist(product);
      toast.info(`Added ${product.name || product.title} to Wishlist! ♡`);
    }
  };

  const productName = product.name || product.title;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-2xl hover:shadow-red-950/40">

      {/* Wishlist Button on Product Image */}
      <button
        onClick={handleToggleWishlist}
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 shadow-md backdrop-blur-sm transition hover:scale-110 border border-zinc-700 ${
          inWishlist ? "text-red-500 border-red-500" : "text-zinc-400 hover:text-red-500"
        }`}
      >
        <svg
          className="h-4 w-4"
          fill={inWishlist ? "currentColor" : "none"}
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
      </button>

      {/* Product Image */}
      <div
        onClick={() =>
          navigate(`/product/${product.category || "all"}/${product.id}`)
        }
        className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden bg-black"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={productName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 filter contrast-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80";
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <span className="absolute bottom-2 left-2 rounded-md bg-black/90 border border-zinc-700 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-400 shadow-sm backdrop-blur-sm">
          {product.category || "Sports"}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 bg-zinc-900">

        <h3
          onClick={() =>
            navigate(`/product/${product.category || "all"}/${product.id}`)
          }
          className="line-clamp-1 cursor-pointer text-sm font-black text-white transition group-hover:text-red-500"
          title={productName}
        >
          {productName}
        </h3>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1.5">
          <div className="flex items-center text-amber-500">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-zinc-300">
            {product.rating || "4.8"}
          </span>
          {product.reviewCount && (
            <span className="text-[11px] text-zinc-500">
              ({product.reviewCount})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-lg font-black tracking-tight text-white">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 pt-2 border-t border-zinc-800">
          <button
            onClick={() =>
              navigate(`/product/${product.category || "all"}/${product.id}`)
            }
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/80 py-2 text-xs font-black uppercase text-zinc-200 transition hover:border-white hover:bg-white hover:text-black"
          >
            Details
          </button>

          <button
            onClick={handleAddToCart}
            disabled={alreadyInCart}
            className={`flex-1 rounded-xl py-2 text-xs font-black uppercase tracking-wider transition ${
              alreadyInCart
                ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                : "bg-red-600 text-white shadow-md shadow-red-600/30 hover:bg-red-700"
            }`}
          >
            {alreadyInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
