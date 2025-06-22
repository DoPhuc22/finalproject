// components/customer/Products/Detail/ProductImages.jsx
import React, { useState } from 'react';
import { Image, Row, Col } from 'antd';

const ProductImages = ({ product, images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(product.imageUrl || '/assets/images/products/default.jpg');
  
  // Sử dụng images từ props hoặc từ product nếu có
  const productImages = images.length > 0 ? images : (product.images || []);
  
  // Nếu không có ảnh nào, hiển thị ảnh mặc định
  if (productImages.length === 0) {
    productImages.push({
      id: 'default',
      imageUrl: product.imageUrl || '/assets/images/products/default.jpg',
      isPrimary: true
    });
  }

  return (
    <div className="product-images">
      {/* Main Image with Preview */}
      <div className="main-image mb-4">
        <Image
          src={selectedImage}
          alt={product.name}
          className="rounded-lg object-cover w-full"
          style={{ height: '400px', objectFit: 'contain' }}
          fallback="/assets/images/products/default.jpg"
          preview={{ 
            src: selectedImage,
            mask: 'Phóng to'
          }}
        />
      </div>
      
      {/* Thumbnail Images */}
      {productImages.length > 1 && (
        <Row gutter={[8, 8]}>
          {productImages.map((image, index) => (
            <Col span={6} key={image.id || index}>
              <div 
                className={`thumbnail cursor-pointer border-2 rounded-md overflow-hidden 
                  ${selectedImage === image.imageUrl ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                <img 
                  src={image.imageUrl} 
                  alt={`${product.name} - ảnh ${index + 1}`}
                  className="w-full h-20 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/products/default.jpg';
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductImages;