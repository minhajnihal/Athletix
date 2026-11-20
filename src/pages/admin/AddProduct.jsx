import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addAdminProduct } from "../../hooks/slice/adminproductSlice";
import formatPrice from "../../utils/formatPrice";

const CATEGORIES = [
  "cricket",
  "football",
  "cycling",
  "fitness",
  "badminton",
  "basketball",
  "swimming",
  "tennis",
  "running",
  "hiking",
  "volleyball",
  "yoga",
  "boxing",
  "table-tennis",
  "camping",
  "skating",
];

const AUDIENCES = ["men", "women", "kids"];

function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "cricket",
    audience: "men",
    price: "",
    image: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning("Please provide a product name");
      return;
    }

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.warning("Please enter a valid price greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);

      const newProduct = {
        name: formData.name.trim(),
        category: formData.category.toLowerCase(),
        audience: formData.audience.toLowerCase(),
        price: numericPrice,
        image:
          formData.image.trim() ||
          "https://placehold.co/600x600/18181b/ffffff?text=AthletiX",
        description: formData.description.trim() || "No description provided.",
      };

      await dispatch(addAdminProduct(newProduct)).unwrap();

      toast.success(`"${newProduct.name}" added successfully!`);
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(error || "Could not add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link to="/admin/products" className="hover:text-white transition">
              Products
            </Link>
            <span>/</span>
            <span className="text-zinc-200">Add Product</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Add New Product
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Fill in the details to publish a new sports item to the store.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition"
        >
          ← Cancel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Product Title / Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Pro English Willow Cricket Bat"
                required
                className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>

            {/* Category & Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 capitalize"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900 capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Target Audience *
                </label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 capitalize"
                >
                  {AUDIENCES.map((aud) => (
                    <option key={aud} value={aud} className="bg-zinc-900 capitalize">
                      {aud.charAt(0).toUpperCase() + aud.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Price (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-zinc-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  min="1"
                  step="any"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2499"
                  required
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Product Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
              <p className="text-[11px] text-zinc-500 mt-1.5">
                Paste a direct image link (PNG, JPG, WebP)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe key specs, material, weight, grip, or training purpose..."
                className="w-full bg-zinc-800/80 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <Link
                to="/admin/products"
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  "Publish Product"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (1 col) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Live Storefront Preview
          </h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
            <div className="aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden relative">
              {formData.image && !imageError ? (
                <img
                  src={formData.image}
                  alt={formData.name || "Preview"}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center p-6 text-zinc-600">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Image Preview</span>
                </div>
              )}

              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-md">
                {formData.audience}
              </span>
            </div>

            <div className="p-5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-red-500">
                {formData.category}
              </span>
              <h3 className="font-bold text-white text-base truncate">
                {formData.name || "Product Name"}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {formData.description || "Product description will appear here."}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xl font-black text-white">
                  {formatPrice(formData.price || 0)}
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
