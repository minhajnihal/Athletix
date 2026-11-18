import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

function CategoryProducts() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [itemsPerPage, setItemsPerPage] = useState(8);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const rawPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useProduct();

  // Filter products based on selected category or search keyword
  const searchLower = (category || "").toLowerCase().trim();
  const categoryProducts = products.filter((product) => {
    const prodCategory = (product.category || "").toLowerCase();
    const prodName = (product.name || product.title || "").toLowerCase();
    const prodDesc = (product.description || "").toLowerCase();

    return (
      prodCategory === searchLower ||
      prodCategory.includes(searchLower) ||
      searchLower.includes(prodCategory) ||
      prodName.includes(searchLower) ||
      prodDesc.includes(searchLower)
    );
  });

  const totalPages = Math.max(1, Math.ceil(categoryProducts.length / itemsPerPage));
  const currentPage = Math.min(rawPage, totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = categoryProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (newPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(newPage));
      }
      return nextParams;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black">
        <p className="text-base font-bold text-zinc-400">
          Loading products...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-black">
        <p className="text-base font-bold text-red-500">
          Failed to load products.
        </p>
        <p className="text-xs text-zinc-500">
          {error?.message}
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-black uppercase text-white transition hover:bg-white hover:text-black"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Discipline Catalog
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              {category} Equipment & Gear
            </h1>
            <p className="mt-1 text-xs text-zinc-400 font-medium">
              {categoryProducts.length} tournament-ready item(s) available.
            </p>
          </div>

          <button
            onClick={() => navigate("/sports/all")}
            className="rounded-xl border-2 border-red-600 bg-black px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-red-600 hover:text-white"
          >
            All Sports →
          </button>
        </div>

        {/* Products Grid */}
        {categoryProducts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-16 text-center shadow-2xl">
            <h2 className="text-xl font-black uppercase text-white">
              No products found for "{category}"
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto font-medium">
              We couldn't find items matching your search. Browse our other sports categories.
            </p>
            <button
              onClick={() => navigate("/sports/all")}
              className="mt-6 rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black shadow-md shadow-red-600/30"
            >
              Browse All Sports
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={categoryProducts.length}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}

      </div>
    </section>
  );
}

export default CategoryProducts;
