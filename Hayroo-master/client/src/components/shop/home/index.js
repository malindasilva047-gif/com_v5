import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";

export const HomeContext = createContext();

const HomeComponent = () => {
  return (
    <div className="bg-white min-h-screen text-gray-900 py-4">
      {/* 1. HERO SLIDER SECTION */}
      <section className="m-4 md:mx-12 mt-16">
        <Slider />
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="m-4 md:mx-12 my-8 bg-gray-50 p-6 rounded-3xl border border-orange-500/20 shadow-lg shadow-orange-500/5">
        <ProductCategory />
      </section>

      {/* 3. PRODUCTS SECTION */}
      <section id="shop" className="m-4 md:mx-12 my-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">Products</span>
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2"></div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <SingleProduct />
        </div>
      </section>
    </div>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;