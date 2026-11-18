
import api from "./api";

// GET: Fetch all orders
export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// GET: Fetch a single order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// GET: Fetch orders belonging to a particular user
export const getUserOrders = async (userIdentifier) => {
  if (!userIdentifier) return [];

  try {
    const response = await api.get("/orders");
    const allOrders = Array.isArray(response.data) ? response.data : [];

    const idStr = String(
      typeof userIdentifier === "object"
        ? userIdentifier.id || ""
        : userIdentifier
    ).toLowerCase();

    const emailStr = String(
      typeof userIdentifier === "object"
        ? userIdentifier.email || ""
        : userIdentifier
    ).toLowerCase();

    return allOrders.filter((order) => {
      const orderUserId = String(order.userId || "").toLowerCase();
      const orderEmail = String(
        order.email || order.customer?.email || ""
      ).toLowerCase();

      return (
        (idStr && orderUserId === idStr) ||
        (emailStr && orderEmail === emailStr) ||
        (idStr && orderEmail === idStr) ||
        (emailStr && orderUserId === emailStr)
      );
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// POST: Create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// PATCH: Update order details or status
export const updateOrder = async ({ id, ...orderData }) => {
  const response = await api.patch(
    `/orders/${id}`,
    orderData
  );

  return response.data;
};

// DELETE: Cancel or remove an order
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
