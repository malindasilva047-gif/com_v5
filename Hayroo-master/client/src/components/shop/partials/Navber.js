// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\partials\Navber.js
import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./style.css";

import { logout } from "./Action";
import { LayoutContext } from "../index";
import { isAdmin } from "../auth/fetchApi";
import { getAllCategory } from "../../admin/categories/FetchApi";

const Navber = () => {
  const history = useHistory();
  const location = useLocation();
  const { data, dispatch } = useContext(LayoutContext);

  const [categories, setCategories] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const navberToggleOpen = () =>
    dispatch({ type: "hamburgerToggle", payload: !data.navberHamburger });

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/search/${searchQuery.trim()}`);
    }
  };

  const cartItemsCount = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length;
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    window.location.reload();
  };

  return (
    <Fragment>
      <nav className="w-full bg-white border-b border-gray-200 shadow-md relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={navberToggleOpen}
                className="text-black bg-gray-100 hover:bg-gray-200 focus:outline-none p-2 rounded-md transition-colors font-bold"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Brand Logo - Explicitly Black Text */}
            <div 
              onClick={() => history.push("/")}
              className="cursor-pointer group flex items-center space-x-2 transition-transform duration-300 transform hover:scale-105"
            >
              <span className="text-xl sm:text-2xl font-black tracking-widest uppercase text-black">
                Unlimite <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">PC House</span>
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => history.push("/")}
                className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 ${
                  location.pathname === "/" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                Home / Shop
              </button>

              {/* Categories Dropdown */}
              <div 
                className="relative group py-2"
                onMouseEnter={() => setCategoryDropdown(true)}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gray-100 text-black font-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all">
                  <span>Categories</span>
                  <svg className="w-4 h-4 text-black transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {categoryDropdown && (
                  <div className="absolute top-full left-0 w-60 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() => {
                            setCategoryDropdown(false);
                            history.push(`/products/category/${cat._id}`);
                          }}
                          className="px-4 py-2 text-sm font-extrabold text-black hover:bg-orange-100 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <span>{cat.cName}</span>
                          <span className="text-xs font-black">→</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs font-bold text-gray-500">No categories found</div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => history.push("/contact-us")}
                className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 ${
                  location.pathname === "/contact-us" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                Contact Us
              </button>
            </div>

            {/* Actions: Search, Cart, Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search PC Parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 text-black text-xs font-bold rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:outline-none focus:border-orange-500 w-44 lg:w-56 transition-all placeholder-gray-500"
                />
                <button type="submit" className="absolute right-3 text-gray-600 hover:text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {/* Wishlist Icon */}
              <button
                onClick={() => history.push("/wish-list")}
                className="p-2 bg-gray-100 rounded-xl text-black hover:bg-gray-200 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill={location.pathname === "/wish-list" ? "#000000" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart Button */}
              <button
                onClick={cartModalOpen}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black p-2.5 rounded-xl transition-all duration-200 relative flex items-center shadow-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemsCount()}
                </span>
              </button>

              {/* Account / Profile Dropdown Component */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="p-2 bg-gray-100 rounded-xl text-black hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                  title="Account Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50">
                    {localStorage.getItem("jwt") ? (
                      <Fragment>
                        <button
                          onClick={() => { setUserDropdown(false); history.push("/user/profile"); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-extrabold text-black hover:bg-gray-100 transition-colors"
                        >
                          My Profile
                        </button>
                        {isAdmin() && (
                          <button
                            onClick={() => { setUserDropdown(false); history.push("/admin/dashboard"); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-extrabold text-orange-600 hover:bg-orange-50 transition-colors"
                          >
                            Admin Dashboard
                          </button>
                        )}
                        <hr className="border-gray-200 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm font-extrabold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <button
                          onClick={() => { setUserDropdown(false); history.push("/login"); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-extrabold text-black hover:bg-gray-100 transition-colors"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => { setUserDropdown(false); history.push("/register"); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-extrabold text-black hover:bg-gray-100 transition-colors"
                        >
                          Create Account
                        </button>
                      </Fragment>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navber;