
import api from "./api";

// GET: Fetch all products
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// GET: Fetch a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// GET: Fetch products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get("/products", {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category products:", error);
    throw error;
  }
};

// GET: Fetch products by audience
export const getProductsByAudience = async (audience) => {
  try {
    const response = await api.get("/products", {
      params: { audience },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching audience products:", error);
    throw error;
  }
};
