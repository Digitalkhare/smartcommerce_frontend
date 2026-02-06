import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import "../components/Chatbot.css";

const fashionSubcategories = ["Men", "Women", "Boys", "Girls"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [params] = useSearchParams();

  const category = params.get("category") || "All";
  const search = params.get("search") || "";

  const isFashion = category === "Fashion";

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = {};

      if (category !== "All") queryParams.category = category;
      if (search.trim()) queryParams.search = search;

      if (isFashion && selectedSubcategories.length > 0) {
        queryParams.subCategories = selectedSubcategories.join(",");
      }

      try {
        const res = await axios.get("/products", { params: queryParams });
        setProducts(res.data);
      } catch (err) {
        console.error(
          "🔥 Product fetch failed:",
          err.response?.data || err.message
        );
      }
    };

    fetchProducts();
  }, [category, search, selectedSubcategories, isFashion]);

  const handleSubcategoryChange = (sub) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const clearSubcategories = () => setSelectedSubcategories([]);

  return (
    <div className="container py-4">
      {/* Header + Filter Button */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Browse Products</h3>

        {isFashion && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#fashionFilters"
            aria-controls="fashionFilters"
          >
            Filter subcategories
            {selectedSubcategories.length > 0 && (
              <span className="badge bg-secondary ms-2">
                {selectedSubcategories.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Offcanvas (Fashion filters) */}
      {isFashion && (
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="fashionFilters"
          aria-labelledby="fashionFiltersLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="fashionFiltersLabel">
              Filter by Subcategory
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>

          <div className="offcanvas-body">
            {fashionSubcategories.map((sub) => (
              <div className="form-check" key={sub}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`sub-${sub}`}
                  checked={selectedSubcategories.includes(sub)}
                  onChange={() => handleSubcategoryChange(sub)}
                />
                <label className="form-check-label" htmlFor={`sub-${sub}`}>
                  {sub}
                </label>
              </div>
            ))}

            {selectedSubcategories.length > 0 && (
              <button
                className="btn btn-link px-0 mt-3"
                onClick={clearSubcategories}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products grid ALWAYS full width */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-4 mb-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
