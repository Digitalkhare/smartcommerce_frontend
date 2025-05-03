import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../api/axios";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/stripe/create-payment-intent", {
        amount,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            address: {
              postal_code: postalCode,
            },
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        await axios.post("/orders/place");
        setSucceeded(true);
        setLoading(false);
        window.location.href = "/order-success";
      }
    } catch (err) {
      console.error("Payment or order placement failed", err);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Complete Payment</h3>

      {succeeded ? (
        <div className="alert alert-success text-center">
          ✅ Payment succeeded!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-control"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Card Details</label>
            <div className="p-2 border rounded">
              <CardElement
                options={{
                  hidePostalCode: true, // ✅ Hide built-in ZIP field
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#a0aec0" },
                    },
                  },
                }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-100 mt-3 d-flex justify-content-center align-items-center"
            type="submit"
            disabled={!stripe || loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
