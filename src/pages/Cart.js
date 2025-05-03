import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");
      console.log("Cart response:", res.data);
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    await axios.delete(`/cart/remove`, {
      params: { productId },
    });
    fetchCart();
    refreshCart();
  };

  const total = (cart.items || []).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // const handleCheckout = async () => {
  //   try {
  //     await axios.post("/orders/place");
  //     alert("✅ Order placed!");
  //     navigate("/order-success");
  //     refreshCart();
  //   } catch (err) {
  //     alert("Failed to place order.");
  //   }
  // };

  const handleCheckout = () => {
    const totalInPence = Math.round(total * 100); // Stripe expects pence
    navigate("/checkout", { state: { amount: totalInPence } });
  };

  if (loading) return <div className="container mt-4">Loading cart...</div>;

  return (
    <div className="container mt-4">
      <h3>Your Shopping Cart</h3>
      {!cart.items || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.items.map((item) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={item.id}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.product.imageUrl}
                    width={60}
                    height={40}
                    alt={item.product.name}
                  />
                  <div>
                    <strong>{item.product.name}</strong>
                    <br />
                    Qty: {item.quantity}
                  </div>
                </div>
                <div>
                  <span>
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={() => removeItem(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4>Total: £{total.toFixed(2)}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
