import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const WishlistContext = createContext();

// Get wishlist from localStorage
const getSavedWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getSavedWishlist);

  // Save wishlist whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    window.dispatchEvent(new Event("wishlistUpdated"));
  }, [wishlist]);

  // Clear wishlist on user logout
  useEffect(() => {
    const handleLogout = () => {
      setWishlist([]);
      localStorage.removeItem("wishlist");
    };

    window.addEventListener("userLogout", handleLogout);
    return () => window.removeEventListener("userLogout", handleLogout);
  }, []);

  // Add product to wishlist
  const addToWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const alreadyExists = previousWishlist.some(
        (item) =>
          String(item.id) === String(product.id) &&
          item.category === product.category
      );

      if (alreadyExists) {
        return previousWishlist;
      }

      return [...previousWishlist, product];
    });
  };

  // Remove product from wishlist
  const removeFromWishlist = (id, category) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter(
        (item) =>
          !(
            String(item.id) === String(id) &&
            item.category === category
          )
      )
    );
  };

  // Check whether a product is in wishlist
  const isInWishlist = (id, category) => {
    return wishlist.some(
      (item) =>
        String(item.id) === String(id) &&
        item.category === category
    );
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");
  };

  // Wishlist item count
  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook
export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}

export default WishlistContext;
