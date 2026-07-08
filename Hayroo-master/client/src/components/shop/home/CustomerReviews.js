import React from "react";

const reviews = [
  {
    id: 1,
    name: "Kasun Perera",
    rating: 5,
    comment: "Extremely fast delivery! My graphics card arrived well-packaged and works perfectly.",
    date: "2 days ago",
    verified: true,
  },
  {
    id: 2,
    name: "Sahan Fernando",
    rating: 5,
    comment: "Hayroo has the best customer service and competitive computer hardware prices.",
    date: "1 week ago",
    verified: true,
  },
  {
    id: 3,
    name: "Nipuni Silva",
    rating: 5,
    comment: "Ordered a mechanical keyboard and gaming mouse. Smooth payment and authentic items!",
    date: "2 weeks ago",
    verified: true,
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-12 bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-black tracking-tight">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-black font-bold text-sm mt-2">
            Verified ratings and feedback from recent buyers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-500 transition-all"
            >
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-orange-500 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-black font-semibold text-sm mb-4 leading-relaxed">
                "{rev.comment}"
              </p>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="font-black text-black text-sm">{rev.name}</span>
                <span className="text-xs font-bold text-orange-500">
                  {rev.verified ? "Verified Purchase" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;