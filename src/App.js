import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import AppNavigator from "./api/AppNavigator";
import OrderSuccess from "./pages/OrderSuccess";
import Account from "./pages/Account";
import ProductDetail from "./pages/ProductDetail";
import Navigationbar from "./components/Navigationbar";
//import { CartProvider } from "./cart/CartContext";
import Chatbot from "./components/Chatbot";
import { useAuth } from "./auth/AuthContext";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  const { user } = useAuth();
  return (
    //<AuthProvider> both moved to index.js
    // <CartProvider>
    <Router>
      <AppNavigator />
      <Navigationbar />
      {/* ← inject navigate function */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            // <ProtectedRoute>
            <CheckoutPage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      {user && <Chatbot />}
    </Router>
    //  </CartProvider>
    //   </AuthProvider>
  );
}

export default App;
