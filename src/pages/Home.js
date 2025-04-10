import React from "react";
import HeroBanner from "../components/HeroBanner";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Home = () => (
  <>
    <HeroBanner />
    <CategoryGrid />
    <FeaturedProducts />
    <Testimonials />
    <Footer />
  </>
);

export default Home;
