import React from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="container text-center py-4">
      <h4>Shop by Category</h4>
      <div className="d-flex flex-wrap justify-content-center mt-3 gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            className="btn btn-outline-secondary"
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
