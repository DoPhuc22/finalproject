import React from 'react';

const PromoSection = () => {
  return (
    <section className="promo-section bg-blue-500 text-white py-10">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Special Promotions</h2>
        <p className="mb-6">Don't miss out on our exclusive offers! Shop now and save big on your favorite watches.</p>
        <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default PromoSection;