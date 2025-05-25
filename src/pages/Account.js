import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const stompClient = useRef(null);

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(res.data);

      // Set userId from response if available
      if (res.data.length > 0 && res.data[0].userId) {
        setUserId(res.data[0].userId);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Connect WebSocket once userId is known
  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("STOMP DEBUG:", msg),

      onConnect: () => {
        const topic = `/topic/orders/${userId}`;
        console.log("📡 Subscribed to:", topic);

        client.subscribe(topic, (message) => {
          const updatedOrder = JSON.parse(message.body);
          setOrders((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
          );
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [userId]);

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
