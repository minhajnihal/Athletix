function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  startIndex = 0,
  endIndex = 0,
  itemsPerPage,
  onItemsPerPageChange,
}) {
  // If only 1 page and no items per page selector needed, hide pagination
  if (totalPages <= 1 && (!itemsPerPage || !onItemsPerPageChange)) {
    return null;
  }

  // Generate page numbers with smart ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page === "..." || page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Product pagination"
      className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-zinc-200 pt-6 md:flex-row"
    >
      {/* Items count & Per Page selector */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500">
        {totalItems > 0 && (
          <p>
            Showing{" "}
            <span className="font-extrabold text-black">
              {Math.min(startIndex + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-extrabold text-black">
              {Math.min(endIndex, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-extrabold text-red-600">{totalItems}</span>{" "}
            products
          </p>
        )}

        {itemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPageSelect" className="text-zinc-500">
              Per page:
            </label>
            <select
              id="itemsPerPageSelect"
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-bold text-zinc-900 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-500"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* First Page Button */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          title="First page"
          aria-label="First page"
        >
          «
        </button>

        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-bold text-zinc-800 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          ‹ Prev
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-6 items-center justify-center text-xs font-bold text-zinc-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-9 min-w-9 rounded-xl px-2 text-xs font-black transition ${
                currentPage === page
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "border border-zinc-200 bg-white text-zinc-800 hover:border-black hover:text-black"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-bold text-zinc-800 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          Next ›
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          title="Last page"
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
