import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../components/Chatbot.css";

const fashionSubcategories = ["Men", "Women", "Boys", "Girls"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [params] = useSearchParams();
  //const navigate = useNavigate();

  const category = params.get("category") || "All";
  const search = params.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = {};

      if (category !== "All") queryParams.category = category;
      if (search.trim()) queryParams.search = search;

      if (category === "Fashion" && selectedSubcategories.length > 0) {
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
  }, [category, search, selectedSubcategories]);

  const handleSubcategoryChange = (sub) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const isFashion = category === "Fashion";

  return (
    <div className="container py-4">
      <h3 className="mb-3">Browse Products</h3>

      <div className="row">
        {isFashion && (
          <div className="col-md-3">
            <div className="mt-2">
              <h5>Filter by Subcategory</h5>
              {fashionSubcategories.map((sub) => (
                <div className="form-check" key={sub}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={sub}
                    checked={selectedSubcategories.includes(sub)}
                    onChange={() => handleSubcategoryChange(sub)}
                  />
                  <label className="form-check-label" htmlFor={sub}>
                    {sub}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={isFashion ? "col-md-9" : "col-12"}>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-md-4 mb-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
