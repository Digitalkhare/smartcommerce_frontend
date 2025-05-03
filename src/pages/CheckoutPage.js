import React from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51RKJTdQgb9TzKAET22xNywoR6XtKGZ4reXBIYLl8qiKMAqEXdUCBRnKMk0iak6BFX9ay7BK8dF2WkjFKuQoWRlRB00iUfuhvN4"
);

const CheckoutPage = () => {
  const location = useLocation();
  const amount = location.state?.amount || 0;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
};

export default CheckoutPage;
