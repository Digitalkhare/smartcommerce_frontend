import React from "react";
import { Link } from "react-router-dom";

const seasonalContent = {
  spring: {
    title: "🌸 Spring Sale is Live!",
    subtitle: "Fresh deals up to 50% off",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
    image: "/images/banners/spring.jpg",
  },
  summer: {
    title: "☀️ Summer Blowout Sale!",
    subtitle: "Hot deals up to 60% off",
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
    image: "/images/banners/summer.jpg",
  },
  autumn: {
    title: "🍂 Autumn Specials!",
    subtitle: "Cozy savings up to 40% off",
    gradient: "linear-gradient(135deg, #8e2de2, #4a00e0)",
    image: "/images/banners/autumn.jpg",
  },
  winter: {
    title: "❄️ Winter Mega Sale!",
    subtitle: "Winter deals up to 70% off",
    gradient: "linear-gradient(135deg, #141e30, #243b55)",
    image: "/images/banners/winter.jpg",
  },
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

const HeroBanner = () => {
  const content = seasonalContent[getCurrentSeason()];

  return (
    <div
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
          url(${content.image})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
          {content.title}
        </h1>

        <p style={{ fontSize: "1.3rem", marginBottom: "20px" }}>
          {content.subtitle}
        </p>

        <Link to="/products" className="btn btn-lg btn-light">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default HeroBanner;
