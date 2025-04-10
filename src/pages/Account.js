import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h3>👤 My Account</h3>

      <hr />
      <h4>Order History</h4>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4">
            <div className="card-header d-flex justify-content-between">
              <div>
                <strong>Order #{order.id}</strong>
                <br />
                Placed:{" "}
                {dayjs(order.orderDateTime).format("MMM D, YYYY h:mm A")}
              </div>
              <span className="badge bg-secondary align-self-center">
                {order.status}
              </span>
            </div>
            <ul className="list-group list-group-flush">
              {order.orderItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="card-footer">
              <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Account;
