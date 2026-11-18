import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

function Sports() {
  const { audience } = useParams();
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
  } = useProduct();

  const selectedAudience = (audience || "all").toLowerCase();

  const filteredProducts =
    selectedAudience === "all"
      ? products
      : products.filter(
          (product) =>
            product.audience?.toLowerCase() === selectedAudience ||
            product.gender?.toLowerCase() === selectedAudience
        );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentPage = Math.min(rawPage, totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
      <div className="flex min-h-[50vh] items-center justify-center bg-black">
        <p className="text-base font-bold text-zinc-400">
          Loading sports gear...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-black">
        {error?.message || "Unable to load products."}
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              AthletiX Catalog
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              {selectedAudience === "all"
                ? "All Sports Products"
                : `${selectedAudience}'s Sports Gear`}
            </h1>
            <p className="mt-1 text-sm text-zinc-400 font-medium">
              Showing {filteredProducts.length} tournament-tested equipment items.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All" },
              { id: "men", label: "Men" },
              { id: "women", label: "Women" },
              { id: "kids", label: "Kids" },
            ].map((item) => {
              const isActive = selectedAudience === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/sports/${item.id}`)}
                  className={`rounded-full px-5 py-2 text-xs font-black uppercase tracking-wide transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-500"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-red-600 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-zinc-800 bg-zinc-900 p-12 mt-8">
            <h2 className="text-xl font-black uppercase text-white">
              No products found
            </h2>
            <p className="mt-2 text-sm text-zinc-400 font-medium">
              No gear found matching this collection.
            </p>
            <button
              onClick={() => navigate("/sports/all")}
              className="mt-6 rounded-xl bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:bg-white hover:text-black"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredProducts.length}
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

export default Sports;
