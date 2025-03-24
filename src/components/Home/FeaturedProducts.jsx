import React from 'react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Luxury Watch',
      price: '$299',
      image: '/assets/images/products/luxury-watch.jpg',
    },
    {
      id: 2,
      name: 'Sport Watch',
      price: '$199',
      image: '/assets/images/products/sport-watch.jpg',
    },
    {
      id: 3,
      name: 'Classic Watch',
      price: '$149',
      image: '/assets/images/products/classic-watch.jpg',
    },
    {
      id: 4,
      name: 'Smart Watch',
      price: '$349',
      image: '/assets/images/products/smart-watch.jpg',
    },
  ];

  return (
    <section className="featured-products">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">{product.price}</p>
            <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;