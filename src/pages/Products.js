import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { useSearchParams, useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const category = params.get("category") || "All";

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("/products", {
        params: category !== "All" ? { category } : {},
      });
      setProducts(res.data);
    };

    fetchProducts();
  }, [category]);

  const handleCategoryChange = (newCategory) => {
    if (newCategory === "All") {
      navigate("/products");
    } else {
      navigate(`/products?category=${encodeURIComponent(newCategory)}`);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Browse Products</h3>
      <CategoryFilter selected={category} onSelect={handleCategoryChange} />
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
