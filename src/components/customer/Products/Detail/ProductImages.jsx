import React, { useState } from 'react';
import { Image, Row, Col, Badge } from 'antd';
import { ZoomInOutlined, ExpandOutlined } from '@ant-design/icons';

const ProductImages = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.imageUrl || '/assets/images/products/watch.jpg');
  
  // Mảng hình ảnh giả lập, trong thực tế sẽ lấy từ product
  const images = [
    product.imageUrl || '/assets/images/products/watch.jpg',
    `/assets/images/products/${product.category}-2.jpg`,
    `/assets/images/products/${product.category}-3.jpg`,
    `/assets/images/products/${product.category}-4.jpg`,
  ];
  
  const handleImageClick = (img) => {
    setMainImage(img);
  };
  
  return (
    <div className="product-images">
      <Badge.Ribbon 
        text={product.discount ? `Giảm ${product.discount}%` : 'Mới'} 
        color={product.discount ? 'red' : 'blue'}
        placement="start"
      >
        <div className="main-image-container mb-4 overflow-hidden rounded-lg">
          <Image
            src={mainImage}
            alt={product.name}
            className="w-full object-cover rounded-lg"
            style={{ height: '500px', objectFit: 'cover' }}
            fallback="/assets/images/products/watch.jpg"
            preview={{
              icons: [<ZoomInOutlined key="zoom" />, <ExpandOutlined key="expand" />],
              mask: <div className="flex items-center justify-center text-white">
                <ZoomInOutlined style={{ fontSize: '24px', marginRight: '8px' }} /> Phóng to
              </div>
            }}
          />
        </div>
      </Badge.Ribbon>

      <Row gutter={[8, 8]} className="thumbnail-container">
        {images.map((img, index) => (
          <Col span={6} key={index}>
            <div 
              className={`cursor-pointer rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-verdigris-500' : 'border-transparent'}`}
              onClick={() => handleImageClick(img)}
            >
              <Image
                src={img}
                alt={`${product.name} - ${index + 1}`}
                className="w-full h-24 object-cover"
                fallback="/assets/images/products/watch.jpg"
                preview={false}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductImages;