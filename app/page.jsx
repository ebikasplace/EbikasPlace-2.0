'use client'
import React from "react";
import HeaderSlider from "@/app/ui/components/HeaderSlider";
import HomeProducts from "@/app/ui/components/HomeProducts";
import Banner from "@/app/ui/components/Banner";
import NewsLetter from "@/app/ui/components/NewsLetter";
import FeaturedProduct from "@/app/ui/components/FeaturedProduct";
import Navbar from "@/app/ui/components/Navbar";
import Footer from "@/app/ui/components/Footer";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
