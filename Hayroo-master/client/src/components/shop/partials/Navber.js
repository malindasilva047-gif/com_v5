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

  const loginModalOpen = () =>
    dispatch({ type: "loginSignupModalToggle", payload: !data.loginSignupModal });

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

  return (
    <Fragment>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={navberToggleOpen}
                className="text-black hover:text-orange-500 focus:outline-none p-2 rounded-md transition-colors"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Brand Logo */}
            <div 
              onClick={() => history.push("/")}
              className="cursor-pointer group flex items-center space-x-2 transition-transform duration-300 transform hover:scale-105"
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-black">
                Hay<span className="text-orange-500 group-hover:text-orange-600 transition-colors">roo</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => history.push("/")}
                className={`font-bold text-base transition-all duration-300 transform hover:scale-105 hover:text-orange-500 py-1 ${
                  location.pathname === "/" ? "text-orange-500 border-b-2 border-orange-500" : "text-black"
                }`}
              >
                Shop
              </button>

              {/* Categories Dropdown */}
              <div 
                className="relative group py-2"
                onMouseEnter={() => setCategoryDropdown(true)}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <button className="flex items-center space-x-1 font-bold text-base text-black hover:text-orange-500 transition-all duration-300 transform group-hover:scale-105">
                  <span>Categories</span>
                  <svg className="w-4 h-4 text-orange-500 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {categoryDropdown && (
                  <div className="absolute top-full left-0 w-60 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() => {
                            setCategoryDropdown(false);
                            history.push(`/products/category/${cat._id}`);
                          }}
                          className="px-4 py-2 text-sm font-bold text-black hover:bg-orange-500 hover:text-white cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <span>{cat.cName}</span>
                          <span className="text-xs">→</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs font-bold text-black">No categories found</div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => history.push("/blog")}
                className={`font-bold text-base transition-all duration-300 transform hover:scale-105 hover:text-orange-500 py-1 ${
                  location.pathname === "/blog" ? "text-orange-500 border-b-2 border-orange-500" : "text-black"
                }`}
              >
                Blog
              </button>

              <button
                onClick={() => history.push("/contact-us")}
                className={`font-bold text-base transition-all duration-300 transform hover:scale-105 hover:text-orange-500 py-1 ${
                  location.pathname === "/contact-us" ? "text-orange-500 border-b-2 border-orange-500" : "text-black"
                }`}
              >
                Contact Us
              </button>
            </div>

            {/* Search, Wishlist, Profile & Cart Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 text-black text-sm font-semibold rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:outline-none focus:border-orange-500 w-44 lg:w-56 transition-all"
                />
                <button type="submit" className="absolute right-3 text-black hover:text-orange-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {/* Wishlist Icon */}
              <button
                onClick={() => history.push("/wish-list")}
                title="Wishlist"
                className="p-2 text-black hover:text-orange-500 transform hover:scale-110 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill={location.pathname === "/wish-list" ? "#F97316" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* User Profile / Login Dropdown */}
              {localStorage.getItem("jwt") ? (
                <div className="relative userDropdownBtn py-2">
                  <button className="p-2 text-black hover:text-orange-500 transform hover:scale-110 transition-all duration-200 flex items-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  <div className="userDropdown absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="py-2">
                      {!isAdmin() ? (
                        <Fragment>
                          <button onClick={() => history.push("/user/orders")} className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-orange-500 hover:text-white flex items-center space-x-2 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <span>My Orders</span>
                          </button>
                          <button onClick={() => history.push("/user/profile")} className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-orange-500 hover:text-white flex items-center space-x-2 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span>My Profile</span>
                          </button>
                          <button onClick={() => history.push("/user/setting")} className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-orange-500 hover:text-white flex items-center space-x-2 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                            <span>Settings</span>
                          </button>
                        </Fragment>
                      ) : (
                        <button onClick={() => history.push("/admin/dashboard")} className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-orange-500 hover:text-white flex items-center space-x-2 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                          <span>Admin Panel</span>
                        </button>
                      )}
                      <div className="border-t border-gray-200 my-1"></div>
                      <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={loginModalOpen}
                  title="Login / Register"
                  className="p-2 text-black hover:text-orange-500 transform hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={cartModalOpen}
                title="Cart"
                className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl transform hover:scale-105 transition-all duration-200 relative flex items-center shadow-md shadow-orange-500/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemsCount()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20" />
    </Fragment>
  );
};

export default Navber;