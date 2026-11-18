import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

// Read cart from localStorage
const getSavedCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getSavedCart);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // Clear cart on user logout
  useEffect(() => {
    const handleLogout = () => {
      setCart([]);
      localStorage.removeItem("cart");
    };

    window.addEventListener("userLogout", handleLogout);
    return () => window.removeEventListener("userLogout", handleLogout);
  }, []);

  // Check if product is already in cart
  const isInCart = (id, category) => {
    if (!id && id !== 0) return false;
    return cart.some((item) => {
      const idMatch = String(item.id) === String(id);
      if (!idMatch) return false;
      if (!category || !item.category) return true;
      return item.category.toLowerCase() === category.toLowerCase();
    });
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) =>
          String(item.id) === String(product.id) &&
          item.category === product.category
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          String(item.id) === String(product.id) &&
          item.category === product.category
            ? {
                ...item,
                quantity: (Number(item.quantity) || 1) + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Remove product from cart
  const removeFromCart = (id, category) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          !(
            String(item.id) === String(id) &&
            item.category === category
          )
      )
    );
  };

  // Increase quantity
  const increaseQuantity = (id, category) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        String(item.id) === String(id) &&
        item.category === category
          ? {
              ...item,
              quantity: (Number(item.quantity) || 1) + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id, category) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          String(item.id) === String(id) &&
          item.category === category
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  (Number(item.quantity) || 1) - 1
                ),
              }
            : item
        )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Calculate total quantity
  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  // Calculate subtotal
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isInCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export default CartContext;
