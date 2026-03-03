import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const categories = [
  "Fashion",
  "Electronics",
  "Home & Living",
  "Books",
  "Sports",
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const goToCategory = (cat) => {
    const params = new URLSearchParams({ category: cat });
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="container text-center py-5 category-grid">
      <h4 className="category-title">Shop by Category</h4>
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className="category-btn"
            onClick={() => goToCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
