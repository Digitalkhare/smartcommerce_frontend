import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import axios from "../api/axios";

const Navigationbar = () => {
  const { user, logout } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [suggestions, setSuggestions] = useState([]);

  const categories = [
    "All",
    "Fashion",
    "Electronics",
    "Books",
    "Sports",
    "Home & Living",
  ];

  const handleLogout = () => {
    logout();
    refreshCart();
  };

  // 🔁 Shared navigation logic
  const navigateWithParams = (cat = category, search = searchTerm) => {
    const params = new URLSearchParams();
    if (cat !== "All") params.set("category", cat);
    if (search.trim()) params.set("search", search.trim());
    navigate(`/products?${params.toString()}`);
    setSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateWithParams();
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    navigateWithParams(newCategory, "");
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get("/products", {
          params: {
            category: category !== "All" ? category : undefined,
            search: searchTerm,
          },
        });
        setSuggestions(res.data.slice(0, 5));
      } catch (err) {
        console.error("Search suggestion failed", err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchTerm, category]);

  const handleSuggestionClick = (productName) => {
    setSearchTerm(productName);
    navigateWithParams(category, productName);
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
                🧑‍💼 Admin
                <span className="badge bg-warning text-dark ms-1">Staff</span>
              </Link>
            </li>
          )}
        </ul>

        {/* 🔍 Search with dropdown category */}
        <form
          className="d-flex align-items-start me-3 position-relative"
          style={{ maxWidth: "480px", width: "100%" }}
          onSubmit={handleSearchSubmit}
        >
          <div className="input-group w-100">
            <select
              className="form-select"
              style={{
                maxWidth: "130px",
                backgroundColor: "#f1f1f1",
                borderTopLeftRadius: "0.375rem",
                borderBottomLeftRadius: "0.375rem",
                borderRight: "1px solid #ced4da",
              }}
              value={category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              className="form-control"
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
            <button className="btn btn-outline-light" type="submit">
              Search
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul
              className="list-group position-absolute bg-white w-100 mt-1 shadow"
              style={{ zIndex: 999, top: "100%", left: 0 }}
            >
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(s.name)}
                  style={{ cursor: "pointer" }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Cart & Auth buttons */}
        <ul className="navbar-nav">
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
