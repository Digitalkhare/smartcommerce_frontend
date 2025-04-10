import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "./ProductCard";
//import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState([]);
  //const navigate = useNavigate();

  useEffect(() => {
    axios.get("/products/featured").then((res) => setFeatured(res.data));
  }, []);
  // useEffect(() => {
  //   axios
  //     .get("/products/featured")
  //     .then((res) => setFeatured(res.data))
  //     .catch((err) => {
  //       console.error("🔴 AXIOS ERROR:", err.message);
  //       console.error("🧨 AXIOS DETAILS:", err);
  //       if (err.response?.status === 401) {
  //         alert("Your session has expired. Please log in again.");
  //         navigate("/login");
  //       } else {
  //         alert("Couldn't load featured products. See console for details.");
  //       }
  //     });
  // }, [navigate]);

  return (
    <div className="container py-4">
      <h4 className="text-center mb-4">Featured Deals</h4>
      <div className="row">
        {featured.map((product) => (
          <div key={product.id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
