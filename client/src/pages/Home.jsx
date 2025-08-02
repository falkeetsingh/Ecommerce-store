import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaTruck, FaClock, FaMoneyBillWave, FaGift } from "react-icons/fa";
import { useEffect } from 'react';


const Home = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === 'about-section') {
      const section = document.querySelector('.about-section');
      if (section) {
        // Timeout ensures DOM is fully painted
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100); 
      }
    }
  }, [location]);
  
  return (
    <div>.
      {/* hero image section */}
      <section className="bg-pink-50 text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Elegance That Lasts Forever</h1>
        <p className="text-gray-600 mb-8">Discover fine handcrafted jewelry.</p>
        <Link to="/" className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700">
          Shop Now
        </Link>
      </section>

      {/* product section */}
      <div className="h-screen flex pt-10 pb-10 pl-20 pr-20">
        {/* Left Full Height Div */}
        <div className="w-1/2 bg-blue-500 flex justify-baseline items-end text-white text-xl m-5 ">
          <Link className="m-10 flex flex-row" to="/products?category=Bracelet">Bracelets <FaArrowRight className="ml-2 mt-1.5"/></Link>
        </div>

        {/* Right Side: Two Half-Height Divs */}
        <div className="w-1/2 flex flex-col mt-5 mb-5">
            <div className="h-1/2 bg-green-500 flex items-end mb-5 justify-baseline text-white text-xl">
              <Link className="m-10 flex flex-row" to="/products?category=Pendant">Pendants <FaArrowRight className="ml-2 mt-1.5"/></Link>
            </div>
            <div className="h-1/2 bg-red-500 flex items-end justify-baseline text-white text-xl">
              <Link className="m-10 flex flex-row" to="/products?category=Earring">Earrings <FaArrowRight className="ml-2 mt-1.5"/></Link>
            </div>
          </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        <Link
          to="/product"
          className="flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md bg-amber-200 border border-white/20 text-gray-800 font-medium shadow-md"
        >
          View All Products
          <FaArrowRight className="text-gray-700 text-sm" />
        </Link>
      </div>

      {/* lower offers panel */}
      <div className="w-full max-w-6xl mx-auto mt-12 px-4 mb-12 ">
        <div className="backdrop-blur-md bg-gray-100 border border-white/20 rounded-xl shadow-lg px-6 py-10 flex flex-wrap justify-between items-center gap-6">
          
          <div className="flex items-center gap-3 text-gray-800 text-lg font-medium w-full sm:w-auto">
            <FaTruck className="text-indigo-600 text-2xl" />
            <span>Free Shipping</span>
          </div>

          <div className="flex items-center gap-3 text-gray-800 text-lg font-medium w-full sm:w-auto">
            <FaClock className="text-indigo-600 text-2xl" />
            <span>Support 24/7</span>
          </div>

          <div className="flex items-center gap-3 text-gray-800 text-lg font-medium w-full sm:w-auto">
            <FaMoneyBillWave className="text-indigo-600 text-2xl" />
            <span>Money Return</span>
          </div>

          <div className="flex items-center gap-3 text-gray-800 text-lg font-medium w-full sm:w-auto">
            <FaGift className="text-indigo-600 text-2xl" />
            <span>Member Discount</span>
          </div>

        </div>
      </div>

      {/* About Section */}
      <div className="w-full px-6 py-16 bg-white about-section">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">About Us</h2>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          {/* Text Content */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center md:text-left">Our Story</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident odio veniam dolore voluptatem expedita ipsa ipsam culpa esse! Sed nobis quis voluptatibus iste mollitia veritatis quia, debitis amet quisquam? Velit.
              <br /><br />
              Vero amet necessitatibus similique expedita doloribus reiciendis ipsum officiis. Eveniet quasi amet laboriosam quidem est, asperiores dicta voluptate sapiente? Tempore quisquam adipisci dolorem eligendi autem assumenda totam ex rem eum.
              <br /><br />
              Sint perspiciatis illum saepe nam? Ipsam mollitia harum, dolor tempore esse ex nulla quis est provident, cupiditate veritatis doloribus velit amet quod optio temporibus odio saepe, perspiciatis asperiores praesentium ab.
            </p>
          </div>

          {/* Image or Placeholder */}
          <div className="md:w-1/2 w-full">
            <div className="w-full h-[300px] md:h-[350px] bg-gray-200 rounded-xl shadow-md flex items-center justify-center text-gray-400 text-xl">
              Image or Illustration
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;
