import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import "../components/ProductCard.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [related, setRelated] = useState([]);
  const [recTitle, setRecTitle] = useState("");
  const [userReview, setUserReview] = useState(null);

  const { refreshCart } = useCart();

  const fetchDetails = useCallback(async () => {
    const prodRes = await axios.get(`/products/${id}`);
    setProduct(prodRes.data);

    const reviewRes = await axios.get(`/reviews/${id}`);
    const allReviews = reviewRes.data;

    if (user) {
      console.log("🧑‍💻 Logged in user:", user);
      const mine = allReviews.find((r) => r.email === user.sub);
      console.log("🧑‍💻 Logged in user:", user);
      console.table(
        allReviews.map((r) => ({
          id: r.id,
          email: r.email,
          name: `${r.firstName} ${r.lastName}`,
          comment: r.comment,
        })),
      );

      setUserReview(mine || null);
      setRating(mine?.rating || 5);
      setComment(mine?.comment || "");
    }
    setReviews(allReviews.filter((r) => r.email !== user.sub));
  }, [id, user]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get("/products/recommended");
      setRelated(res.data);
      setRecTitle("🎯 You May Also Like");
    } catch (err) {
      console.error(
        "❌ Recommendation error:",
        err.response?.data || err.message,
      );
      try {
        const fallback = await axios.get("/products/featured");
        setRelated(fallback.data.slice(0, 3));
        setRecTitle("🌟 Featured Products");
      } catch (fallbackErr) {
        console.error(
          "❌ Failed to load even featured products!",
          fallbackErr.message,
        );
        setRelated([]);
      }
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchRecommendations();
  }, [id, fetchDetails]);

  const addToCart = async () => {
    await axios.post(`/cart/add`, null, {
      params: { productId: id, quantity: 1 },
    });
    alert("Added to cart!");
    refreshCart();
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/reviews/${id}`, { rating, comment });
      setUserReview(null); // Reset to refetch clean
      setComment("");
      setRating(5);
      fetchDetails();
    } catch (err) {
      console.error("Review error:", err);
      console.error("Server response:", err.response?.data);
      alert(
        "❌ Review failed: " + (err.response?.data?.message || "Bad Request"),
      );
    }
  };

  if (!product) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-4 product-detail-page">
      <div className="row mb-4">
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid product-detail-image"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>£{product.price.toFixed(2)}</h4>
          <button className="btn btn-primary" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <hr />

      <h4>Reviews</h4>
      {userReview && (
        <div className="mb-3 border-bottom pb-2 text-primary">
          <strong>{`${userReview.firstName} ${userReview.lastName}'s review`}</strong>{" "}
          - {userReview.rating} ⭐<p>{userReview.comments}</p>
        </div>
      )}

      {reviews.map((r) => (
        <div key={r.id} className="mb-3 border-bottom pb-2">
          <strong>{r.firstName + " " + r.lastName || "Anonymous"}</strong> -{" "}
          {r.rating} ⭐<p>{r.comments}</p>
        </div>
      ))}

      {user && (
        <form onSubmit={submitReview} className="mb-5">
          <h5>Leave a review</h5>
          <select
            className="form-select mb-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
          <textarea
            className="form-control mb-2"
            placeholder="Write your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-outline-success">
            {userReview ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}

      <hr />

      <h4 className="featured-title">{recTitle}</h4>
      <div className="row">
        <div className="row related-products-grid">
          {related.map((p) => (
            <div key={p.id} className="col-md-4">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
