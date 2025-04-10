import React from "react";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Books",
  "Home & Living",
  "Sports",
];

// const categories = [
//   { label: "All", value: "All" },
//   { label: "Electronics", value: "Electronics" },
//   { label: "Fashion", value: "Fashion" },
//   { label: "Books", value: "Books" },
//   { label: "Home", value: "Home & Living" },
//   { label: "Sports", value: "Sports" },
// ];

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
