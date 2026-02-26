import React from "react";
import axios from "../api/axios";
import { escapeAmpInTextParam } from "../util/escapeAmpInTextParam";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    await axios.post("/cart/add", null, {
      params: { productId: product.id, quantity: 1 },
    });
    alert("Added to cart!");
    refreshCart();
  };

  return (
    <div className="card mb-3">
      <Link to={`/products/${product.id}`}>
        <img
          src={escapeAmpInTextParam(product.imageUrl)}
          className="card-img-top product-card-img"
          alt={product.name}
        />
      </Link>
      {/* {console.log("Fixed Image URL:", escapeAmpInTextParam(product.imageUrl))} */}
      <div className="card-body">
        <h5>
          <Link
            to={`/products/${product.id}`}
            className="text-decoration-none text-dark"
          >
            {product.name}
          </Link>
        </h5>
        <p>£{product.price.toFixed(2)}</p>
        <Link
          to={`/products/${product.id}`}
          className="btn btn-sm btn-outline-primary"
        >
          View Details
        </Link>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
