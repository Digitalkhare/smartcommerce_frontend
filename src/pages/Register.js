import React, { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/register", {
        email,
        firstName,
        lastName,
        password,
      });

      // Optional: Auto-login after registration
      if (res.data.token) {
        login(res.data.token);
        navigate("/products");
      } else {
        navigate("/login"); // fallback
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Email may be in use.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Create an Account</h3>
      <form onSubmit={handleRegister}>
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-2"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
