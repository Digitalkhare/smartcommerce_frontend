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
        <div
          className="media media--hybrid"
          style={{ "--bg": `url("${escapeAmpInTextParam(product.imageUrl)}")` }}
        >
          <img
            src={escapeAmpInTextParam(product.imageUrl)}
            alt={product.name}
            className="media__img"
            loading="lazy"
          />
        </div>
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
        <div className="pc-actions">
          <Link
            to={`/products/${product.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            View
          </Link>

          <button
            className="btn btn-sm btn-primary"
            onClick={handleAddToCart}
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
