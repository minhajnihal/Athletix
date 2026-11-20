import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAdminProducts,
  deleteAdminProduct,
} from "../../hooks/slice/adminproductSlice";
import formatPrice from "../../utils/formatPrice";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

const CATEGORIES = [
  "all",
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

const AUDIENCES = ["all", "men", "women", "kids"];

function AdminProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading } = useSelector(
    (state) => state.adminProducts
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleAudienceChange = (value) => {
    setSelectedAudience(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedAudience("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Audience filter
    if (selectedAudience !== "all") {
      result = result.filter(
        (p) => (p.audience || "").toLowerCase() === selectedAudience.toLowerCase()
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return result;
  }, [products, search, selectedCategory, selectedAudience, sortBy]);

  // Paginated slice
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await dispatch(deleteAdminProduct(productToDelete.id)).unwrap();
      toast.success(`"${productToDelete.name}" deleted successfully`);
      setProductToDelete(null);
    } catch (err) {
      toast.error(err || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAudienceBadge = (audience) => {
    switch (audience?.toLowerCase()) {
      case "men":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "women":
        return "bg-pink-500/10 text-pink-400 border-pink-500/30";
      case "kids":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Product Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your store's sports inventory ({products.length} total products)
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, category..."
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-3 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 capitalize"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 capitalize">
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Audience Filter */}
          <div>
            <select
              value={selectedAudience}
              onChange={(e) => handleAudienceChange(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 capitalize"
            >
              {AUDIENCES.map((aud) => (
                <option key={aud} value={aud} className="bg-zinc-900 capitalize">
                  {aud === "all" ? "All Audiences" : `${aud.charAt(0).toUpperCase() + aud.slice(1)}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="default" className="bg-zinc-900">Default Order</option>
              <option value="price-low" className="bg-zinc-900">Price: Low to High</option>
              <option value="price-high" className="bg-zinc-900">Price: High to Low</option>
              <option value="name-asc" className="bg-zinc-900">Name: A to Z</option>
              <option value="name-desc" className="bg-zinc-900">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Active filters indicators */}
        {(search || selectedCategory !== "all" || selectedAudience !== "all") && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
            <span>Active filters:</span>
            {search && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">
                "{search}"
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 capitalize">
                Category: {selectedCategory}
              </span>
            )}
            {selectedAudience !== "all" && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 capitalize">
                Audience: {selectedAudience}
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="ml-auto text-red-400 hover:text-red-300 underline text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {loading && products.length === 0 ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-sm mx-auto">
              No products match your current search and filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Product</th>
                  <th className="py-4 px-4 font-semibold">Category</th>
                  <th className="py-4 px-4 font-semibold">Audience</th>
                  <th className="py-4 px-4 font-semibold">Price</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {paginatedProducts.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-zinc-800/30 transition group"
                    >
                      {/* Product Image & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/60 overflow-hidden shrink-0 flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/100x100/18181b/ffffff?text=Product";
                                }}
                              />
                            ) : (
                              <span className="text-xs text-zinc-500">No img</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-xs sm:max-w-md">
                              {product.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate max-w-xs line-clamp-1">
                              {product.description || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60 capitalize">
                          {product.category}
                        </span>
                      </td>

                      {/* Audience */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize ${getAudienceBadge(
                            product.audience
                          )}`}
                        >
                          {product.audience || "Unspecified"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-white text-base">
                        {formatPrice(product.price)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
                            title="Edit Product"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => setProductToDelete(product)}
                            title="Delete Product"
                            className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(val) => setItemsPerPage(val)}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Delete Product</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Are you sure you want to permanently delete{" "}
                <span className="text-white font-semibold">
                  "{productToDelete.name}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
