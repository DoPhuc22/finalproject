import React from 'react';
import { Typography, Button, Card, Row, Col, Rate, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../../../store/slices/productSlice';

const { Title, Text } = Typography;
const { Meta } = Card;

const FeaturedProducts = () => {
  const allProducts = useSelector(selectAllProducts);
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <Title level={2} className="m-0">Sản Phẩm Nổi Bật</Title>
        <Link to="/products" className='hover:no-underline'>
          <Button type="link" icon={<ArrowRightOutlined />}>Xem tất cả</Button>
        </Link>
      </div>
      
      <Row gutter={[24, 24]}>
        {featuredProducts.map(product => (
          <Col xs={24} sm={12} lg={6} key={product.id}>
            <Link to={`/products/${product.id}`} className='hover:no-underline'>
              <Card
                hoverable
                cover={
                  <div className="h-60 overflow-hidden">
                    <img 
                      alt={product.name} 
                      src={product.imageUrl} 
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                    />
                  </div>
                }
                className="h-full product-card"
              >
                <Meta
                  title={product.name}
                  description={
                    <div>
                      <Rate allowHalf disabled defaultValue={product.rating} className="text-sm mb-2" />
                      <div className="flex justify-between items-center">
                        <Text strong className="text-lg text-blue-600">
                          {product.price.toLocaleString()} VNĐ
                        </Text>
                        <Tag color={product.inStock ? 'success' : 'error'}>
                          {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                        </Tag>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturedProducts;