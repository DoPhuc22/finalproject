import React from 'react';
import { Typography, Row, Col, Card, Rate, Tag, Tooltip } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProducts } from '../../../../store/slices/productSlice';
import { addToCart } from '../../../../store/slices/cartSlice';

const { Title, Text } = Typography;
const { Meta } = Card;

const RelatedProducts = ({ currentProductId, category, brand }) => {
  const allProducts = useSelector(selectAllProducts);
  const dispatch = useDispatch();
  
  // Lọc ra 4 sản phẩm liên quan (cùng danh mục hoặc cùng thương hiệu, nhưng không phải sản phẩm hiện tại)
  const relatedProducts = allProducts
    .filter(product => product.id !== currentProductId && (product.category === category || product.brand === brand))
    .slice(0, 4);
  
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
      brand: product.brand,
      quantity: 1
    }));
  };
  
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products">
      <Title level={3} className="mb-8">Sản phẩm liên quan</Title>
      
      <Row gutter={[24, 32]}>
        {relatedProducts.map(product => (
          <Col xs={24} sm={12} md={6} key={product.id}>
            <Card
              hoverable
              cover={
                <div className="h-60 overflow-hidden">
                  <img 
                    alt={product.name} 
                    src={product.imageUrl || '/assets/images/products/watch.jpg'} 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                  />
                </div>
              }
              actions={[
                <Tooltip title="Xem chi tiết">
                  <Link to={`/products/${product.id}`} className='hover:no-underline'>
                    <EyeOutlined key="view" />
                  </Link>
                </Tooltip>,
                <Tooltip title="Thêm vào giỏ hàng">
                  <ShoppingCartOutlined key="cart" onClick={() => handleAddToCart(product)} />
                </Tooltip>,
              ]}
              className="product-card h-full"
            >
              <Meta
                title={
                  <Link to={`/products/${product.id}`} className="text-lg font-medium hover:text-verdigris-500 hover:no-underline">
                    {product.name}
                  </Link>
                }
                description={
                  <div>
                    <div className="mb-2">
                      <Rate allowHalf disabled defaultValue={product.rating || 4.5} className="text-sm" />
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <Tag color={product.inStock ? 'success' : 'error'}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </Tag>
                      <Tag color="blue">{product.brand}</Tag>
                    </div>
                    <Text strong className="text-lg text-verdigris-600">
                      {product.price?.toLocaleString() || 0} VNĐ
                    </Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RelatedProducts;