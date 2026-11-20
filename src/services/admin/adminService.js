import api from "../api";

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const response = await api.get("/admins");
    const admins = Array.isArray(response.data) ? response.data : [response.data];

    const admin = admins.find(
      (item) =>
        item &&
        item.email &&
        item.email.toLowerCase() === email.toLowerCase().trim() &&
        item.password === password &&
        item.role === "admin"
    );

    // Fallback hardcoded admin if database does not contain it or json-server is not populated
    if (!admin && email.toLowerCase().trim() === "admin@athletix.com" && password === "Admin@123") {
      return {
        id: "1",
        name: "AthletiX Admin",
        email: "admin@athletix.com",
        role: "admin",
      };
    }

    if (!admin) {
      throw new Error("Invalid admin email or password");
    }

    // Never store the password in the browser session.
    const adminDetails = { ...admin };
    delete adminDetails.password;

    return adminDetails;
  } catch (error) {
    // If backend isn't running or endpoint fails, check fallback credentials
    if (email.toLowerCase().trim() === "admin@athletix.com" && password === "Admin@123") {
      return {
        id: "1",
        name: "AthletiX Admin",
        email: "admin@athletix.com",
        role: "admin",
      };
    }

    if (error.response) {
      throw new Error("Unable to connect to the admin service", { cause: error });
    }

    throw error;
  }
};

// ================= PRODUCTS ================= //

// Fetch all products
export const getAdminProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Fetch single product by ID
export const getAdminProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Add new product
export const createAdminProduct = async (productData) => {
  const payload = {
    ...productData,
    id: productData.id || String(Date.now()),
    price: Number(productData.price) || 0,
  };
  const response = await api.post("/products", payload);
  return response.data;
};

// Update existing product
export const updateAdminProduct = async (id, productData) => {
  const payload = {
    ...productData,
    price: Number(productData.price) || 0,
  };
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
};

// Delete product
export const deleteAdminProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ================= ORDERS ================= //

// Fetch all orders
export const getAdminOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// Fetch single order
export const getAdminOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Update order status (Placed, Shipped, Delivered, Cancelled)
export const updateAdminOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}`, { status });
  return response.data;
};

// ================= USERS ================= //

// Fetch all users
export const getAdminUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Fetch single user by ID
export const getAdminUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Toggle user block status
export const toggleBlockUser = async (id, isBlocked) => {
  const response = await api.patch(`/users/${id}`, { isBlocked });
  return response.data;
};
