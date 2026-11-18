
import api from "./api";

// GET: Fetch all users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// GET: Fetch a single user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// GET: Find a user by email
export const getUserByEmail = async (email) => {
  const normalizedEmail = (email || "").trim().toLowerCase();
  try {
    const response = await api.get("/users", {
      params: {
        email: normalizedEmail,
      },
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }

    // Fallback search across users
    const allUsers = await api.get("/users");
    if (Array.isArray(allUsers.data)) {
      return (
        allUsers.data.find(
          (u) => (u.email || "").toLowerCase() === normalizedEmail
        ) || null
      );
    }

    return null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

// POST: Register a new user
export const createUser = async (userData) => {
  const payload = {
    id: userData.id || Date.now().toString(),
    ...userData,
  };
  const response = await api.post("/users", payload);
  return response.data;
};

// PATCH: Update user details
export const updateUser = async ({ id, ...userData }) => {
  const response = await api.patch(
    `/users/${id}`,
    userData
  );

  return response.data;
};

// DELETE: Delete a user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
