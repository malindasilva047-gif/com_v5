import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Fragment>
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-gray-900 mt-12">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Brand & About */}
            <div>
              <h3 className="text-2xl font-black tracking-tight uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                YourBrand
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                We deliver the best quality products directly to your doorstep. Experience premium shopping with verified customer reviews and secure payments.
              </p>
              {/* Social Icons Placeholder */}
              <div className="flex space-x-4">
                <a href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li><Link to="/shop" className="hover:text-orange-500 transition-colors">Shop</Link></li>
                <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-gray-900">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-orange-500 transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-gray-900">Stay Updated</h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Subscribe to our newsletter to get the latest updates and offers.
              </p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <button 
                  type="button" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-r-md font-bold transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
            </p>
            {/* Payment Badges Placeholder */}
            <div className="flex space-x-3 mt-4 md:mt-0 text-gray-400">
              <span className="font-bold text-sm tracking-widest uppercase">Secure Checkout</span>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;