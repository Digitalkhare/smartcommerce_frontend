import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";

const Navigationbar = () => {
  const { user, logout } = useAuth();
  const { cart, refreshCart } = useCart();

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  console.log("Logged-in user:", user);

  const handleLogout = () => {
    logout(); // Clear token and user
    refreshCart(); // Re-fetch cart - should return empty if unauthenticated
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 sticky-top">
      <Link to="/" className="navbar-brand">
        Smart Commerce
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link to="/products" className="nav-link">
              Shop
            </Link>
          </li>
          {user && (
            <li className="nav-item">
              <Link to="/account" className="nav-link">
                Account
              </Link>
            </li>
          )}
          {user?.roles?.includes("ROLE_ADMIN") && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                🧑‍💼 Admin{" "}
                <span className="badge bg-warning text-dark ms-1">Staff</span>
              </Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item position-relative">
            <Link to="/cart" className="nav-link position-relative">
              🛒 Cart
              {itemCount > 0 && (
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: "14px",
                    left: "0px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </li>

          {!user ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button
                className="btn btn-sm btn-outline-light ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigationbar;
