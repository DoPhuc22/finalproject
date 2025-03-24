import React from 'react';

const Banner = () => {
  return (
    <div className="relative w-full h-64 bg-blue-500 flex items-center justify-center">
      <h1 className="text-white text-4xl font-bold">Welcome to Watch Store</h1>
      <p className="text-white text-lg mt-2">Your one-stop shop for stylish wristwatches</p>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500 to-transparent"></div>
    </div>
  );
};

export default Banner;