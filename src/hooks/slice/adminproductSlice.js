import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct as updateProductService,
  deleteAdminProduct as deleteProductService,
} from "../../services/admin/adminService";

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAdminProducts();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

// Add product
export const addAdminProduct = createAsyncThunk(
  "adminProducts/addAdminProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const created = await createAdminProduct(productData);
      return created;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add product");
    }
  }
);

// Update product
export const updateAdminProduct = createAsyncThunk(
  "adminProducts/updateAdminProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const updated = await updateProductService(id, productData);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

// Delete product
export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/deleteAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchQuery: "",
    selectedCategory: "all",
    selectedAudience: "all",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedAudience: (state, action) => {
      state.selectedAudience = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "all";
      state.selectedAudience = "all";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => String(p.id) === String(action.payload.id)
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => String(p.id) !== String(action.payload)
        );
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedAudience,
  clearFilters,
} = adminProductSlice.actions;

export default adminProductSlice.reducer;
