import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");
      setCart(res.data);
    } catch (err) {
      setCart({ items: [] }); // fallback if unauthenticated
    }
  };

  const refreshCart = () => fetchCart(); // Exposed for pages to trigger manually

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
