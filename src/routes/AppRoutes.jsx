import { Routes, Route } from "react-router-dom";

// Layout
import UserLayout from "../layouts/UserLayout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Wishlist from "../pages/Wishlist";
import ProductDetails from "../pages/ProductDetails";
import CategoryProducts from "../pages/CategoryProducts";
import Sports from "../pages/Sports";
import Profile from "../pages/Profile";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Layout */}
      <Route element={<UserLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:category/:id" element={<ProductDetails />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/sports/:audience" element={<Sports />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
