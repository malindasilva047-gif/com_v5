import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { getAllCategory } from "../../../admin/categories/FetchApi";
import { getAllCategory } from "../../admin/categories/FetchApi";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories.slice(0, 5)); // Top categories
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      alert("Unlimite Pc House Newsletter එකට ලියාපදිංචි වීම සාර්ථකයි!");
      setEmail("");
    }
  };

  return (
    <Fragment>
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 pt-16 pb-8 mt-20 relative overflow-hidden">
        {/* Glow Background effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Brand Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                Unlimite Pc House
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                ඔබට අවශ්‍ය සියලුම High-Performance PC Parts, Gaming Rigs සහ Tech Accessories හොඳම වගකීමක් සහ විශ්වාසනීයත්වයක් සහිතව ලබාගන්න.
              </p>
              <div className="pt-2">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Hotline / WhatsApp</p>
                <a 
                  href="https://wa.me/94715780287" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 font-bold text-lg hover:underline flex items-center space-x-2"
                >
                  <span>+94 71 578 0287</span>
                </a>
              </div>
            </div>

            {/* Dynamic Top Categories */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3">Top Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <Link 
                        to={`/products/category/${cat._id}`}
                        className="hover:text-cyan-400 transition-colors flex items-center space-x-2"
                      >
                        <span className="text-cyan-500">›</span>
                        <span>{cat.cName}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Loading categories...</li>
                )}
              </ul>
            </div>

            {/* Trust Signals & Navigation */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3">Trust & Support</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>100% Genuine Products</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>Verified Purchase Reviews</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>Island-wide Delivery</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>Braintree Secure Payments</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3">Newsletter</h4>
              <p className="text-sm text-slate-400 mb-4">
                නව කොම්පියුටර් උපාංග සහ විශේෂ දීමනා පිළිබඳ ක්ෂණික දැනුවත්වීම් ලබා ගැනීමට එකතු වන්න.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ඔබගේ Email ලිපිනය" 
                  className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                >
                  Subscribe Now
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Footer & Badges */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Unlimite Pc House. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0 items-center">
              <span role="img" aria-label="heart" className="text-red-500">❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;