import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "./ProductCard";
import Slider from "react-slick";

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get("/products/featured").then((res) => setFeatured(res.data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 992, // Tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576, // Phones
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container py-5">
      <h4 className="text-center mb-4">Featured Deals</h4>
      <Slider {...settings}>
        {featured.map((product) => (
          <div key={product.id} className="px-3">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
