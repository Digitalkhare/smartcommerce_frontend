import React from "react";

const categories = [
  "Fashion",
  "Electronics",
  "Home & Living",
  "Books",
  "Sports",
];

const CategoryGrid = () => (
  <div className="container text-center py-4">
    <h4>Shop by Category</h4>
    <div className="d-flex flex-wrap justify-content-center mt-3 gap-3">
      {categories.map((cat, i) => (
        <button key={i} className="btn btn-outline-secondary">
          {cat}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryGrid;
