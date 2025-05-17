import React from 'react';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Đồng hồ cơ', image: '/assets/images/categories/mechanical.jpg' },
    { id: 2, name: 'Đồng hồ điện tử', image: '/assets/images/categories/digital.jpg' },
    { id: 3, name: 'Đồng hồ thông minh', image: '/assets/images/categories/smart.jpg' },
    { id: 4, name: 'Đồng hồ thời trang', image: '/assets/images/categories/fashion.jpg' },
  ];

  return (
    <section className="categories py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Danh Mục Sản Phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <div key={category.id} className="category-card border rounded-lg overflow-hidden shadow-lg">
            <img src={category.image} alt={category.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;