import React from "react";
import { Link } from "react-router-dom";
const HeroBanner = () => (
  <div className="bg-light p-5 text-center">
    <h1>🔥 Spring Sale is Live!</h1>
    <p>Up to 50% off on electronics, fashion, and more</p>
    <Link to="/products" className="btn btn-primary">
      Shop Now
    </Link>
  </div>
);

export default HeroBanner;
