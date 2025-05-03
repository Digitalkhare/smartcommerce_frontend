import React from "react";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Books",
  "Home & Living",
  "Sports",
];

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`btn btn-sm ${
            cat === selected ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
