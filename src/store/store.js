import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../hooks/slice/authSlice";
import adminProductsReducer from "../hooks/slice/adminproductSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
  },
});

export default store;
