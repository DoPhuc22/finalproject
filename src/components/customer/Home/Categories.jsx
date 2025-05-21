import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Categories = () => {
  // Categories data
  const categories = [
    { id: 1, name: 'Đồng hồ cơ', image: '/assets/images/products/watch.jpg', count: 24 },
    { id: 2, name: 'Đồng hồ thể thao', image: '/assets/images/products/watch.jpg', count: 18 },
    { id: 3, name: 'Đồng hồ thông minh', image: '/assets/images/products/watch.jpg', count: 32 },
    { id: 4, name: 'Đồng hồ sang trọng', image: '/assets/images/products/watch.jpg', count: 15 },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12">Danh Mục Sản Phẩm</Title>
        
        <Row gutter={[24, 24]}>
          {categories.map(category => (
            <Col xs={24} sm={12} lg={6} key={category.id}>
              <Link to={`/products?category=${category.name}`} className='hover:no-underline'>
                <Card 
                  hoverable 
                  className="category-card overflow-hidden"
                  cover={
                    <div className="relative h-48">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4 text-white w-full">
                          <Text className="text-lg font-bold block">{category.name}</Text>
                          <Text className="text-white/80">{category.count} sản phẩm</Text>
                        </div>
                      </div>
                    </div>
                  }
                />
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Categories;