import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestOrder = async () => {
    try {
      const res = await axios.get("/orders/latest");
      setOrder(res.data);
    } catch (err) {
      console.error("Could not fetch latest order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!order) return <div className="container mt-5">No order found.</div>;

  return (
    <div className="container mt-5 text-center">
      <h2>🎉 Thank you for your order!</h2>
      <p>Order #{order.id} has been placed successfully.</p>

      <h4 className="mt-4">Order Summary</h4>
      <ul className="list-group mb-3">
        {order.orderItems?.length > 0 ? (
          order.orderItems.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))
        ) : (
          <p>No items in this order.</p>
        )}
      </ul>
      <h5>Total Paid: £{order.totalAmount.toFixed(2)}</h5>
      <p className="text-muted">Expected delivery in 3–5 days</p>

      <Link to="/products" className="btn btn-outline-primary mt-3">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
