// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\home\Slider.js
import React, { Fragment, useEffect, useContext, useState } from "react";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);

  // Safely extract length for dependency tracking
  const totalSlides = data?.sliderImages?.length || 0;

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        nextSlide(totalSlides, slide, setSlide);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [totalSlides, slide]);

  const handlePrev = () => {
    if (totalSlides > 0) {
      prevSlide(totalSlides, slide, setSlide);
    }
  };

  const handleNext = () => {
    if (totalSlides > 0) {
      nextSlide(totalSlides, slide, setSlide);
    }
  };

  return (
    <Fragment>
      <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-gray-950 h-72 sm:h-96 md:h-[480px] lg:h-[520px] group border border-gray-800 my-4">
        {totalSlides > 0 ? (
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-105"
              src={
                data.sliderImages[slide]?.slideImage?.startsWith("http")
                  ? data.sliderImages[slide].slideImage
                  : `${apiURL}/uploads/customize/${data.sliderImages[slide]?.slideImage}`
              }
              alt="Hero Tech Showcase"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent"></div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 max-w-2xl">
              <span className="inline-flex items-center justify-center gap-2 bg-orange-500/10 backdrop-blur-md border border-orange-500/30 rounded-full w-fit px-3 py-1 mb-3 text-xs md:text-sm font-extrabold uppercase tracking-widest text-orange-400">
                <span role="img" aria-label="lightning">⚡</span> Exclusive Deals & Tech Gear
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
                Elevate Your Tech Setup Today
              </h1>
              <a
                href="#shop"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:-translate-y-1 w-fit"
              >
                <span>Explore Products</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white border border-white/20 transition-all duration-300 focus:outline-none"
              aria-label="Previous Slide"
            >
              <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white border border-white/20 transition-all duration-300 focus:outline-none"
              aria-label="Next Slide"
            >
              <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-6 right-6 z-20 flex space-x-2 bg-gray-900/60 backdrop-blur-md p-2 rounded-full border border-white/10">
              {data.sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    slide === idx ? "w-8 bg-orange-500 shadow-md" : "w-2.5 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900 animate-pulse">
            <span className="font-semibold text-sm">Loading Showcase...</span>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="my-10 bg-gray-50 rounded-3xl p-8 border border-gray-200">
        <h2 className="text-xl md:text-2xl font-black text-black tracking-tight mb-6 uppercase">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex text-amber-500 mb-2">
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
            </div>
            <p className="text-sm text-gray-700 font-medium italic">"Best place in Sri Lanka to buy genuine custom PC components. Highly recommended!"</p>
            <div className="mt-4 font-black text-xs text-black uppercase tracking-wider">- Lakmal R.</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex text-amber-500 mb-2">
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
            </div>
            <p className="text-sm text-gray-700 font-medium italic">"Extremely fast delivery and excellent customer support for warranty claims."</p>
            <div className="mt-4 font-black text-xs text-black uppercase tracking-wider">- Sachith D.</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex text-amber-500 mb-2">
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
              <span role="img" aria-label="star">⭐</span>
            </div>
            <p className="text-sm text-gray-700 font-medium italic">"The build quality of their pre-builts is incredibly neat. Clean wire management."</p>
            <div className="mt-4 font-black text-xs text-black uppercase tracking-wider">- Lahiru K.</div>
          </div>
        </div>
      </div>

      <OrderSuccessMessage />
    </Fragment>
  );
};

export default Slider;