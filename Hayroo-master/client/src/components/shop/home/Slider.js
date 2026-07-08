import React, { Fragment, useEffect, useContext, useState } from "react";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    if (data?.sliderImages?.length > 1) {
      const interval = setInterval(() => {
        nextSlide(data.sliderImages.length, slide, setSlide);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [data.sliderImages, slide]);

  return (
    <Fragment>
      <div className="relative w-full overflow-hidden rounded-xl shadow-md bg-gray-900 h-64 sm:h-80 md:h-96 group">
        {data?.sliderImages?.length > 0 ? (
          <div className="relative w-full h-full">
            {/* Slide Background Image */}
            <img
              className="w-full h-full object-cover transition-all duration-700 ease-in-out opacity-90"
              src={`${apiURL}/uploads/customize/${data.sliderImages[slide].slideImage}`}
              alt="Hero Banner"
            />

            {/* Subtle Overlay Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

            {/* Centered CTA Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-yellow-400 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-2">
                Featured Collection
              </span>
              <a
                href="#shop"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium text-sm md:text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-yellow-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Shop Now
              </a>
            </div>

            {/* Left Nav Arrow */}
            <button
              onClick={() =>
                prevSlide(data.sliderImages.length, slide, setSlide)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all duration-200 focus:outline-none opacity-80 group-hover:opacity-100"
              aria-label="Previous Slide"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={() =>
                nextSlide(data.sliderImages.length, slide, setSlide)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all duration-200 focus:outline-none opacity-80 group-hover:opacity-100"
              aria-label="Next Slide"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Slide Position Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
              {data.sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    slide === idx ? "w-6 bg-yellow-500" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800 text-sm">
            Loading Hero Highlights...
          </div>
        )}
      </div>
      <OrderSuccessMessage />
    </Fragment>
  );
};

export default Slider;