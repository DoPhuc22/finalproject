import React, { useState } from 'react';
import { Typography, Rate, Tag, Divider, Button, InputNumber, Space, message, Tooltip } from 'antd';
import { HeartOutlined, ShareAltOutlined, ShoppingCartOutlined, ThunderboltOutlined, SafetyCertificateOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../store/slices/cartSlice';

const { Title, Text, Paragraph } = Typography;

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    if (!product.inStock) {
      message.error('Sản phẩm hiện đang hết hàng');
      return;
    }
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
      brand: product.brand,
      quantity: quantity
    }));
    
    message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    // Chuyển đến trang giỏ hàng
    window.location.href = '/checkout';
  };
  
  // Xử lý thay đổi số lượng
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };
  
  // Tính giá sau khi giảm giá
  const calculateDiscountedPrice = () => {
    if (!product.discount) return null;
    const discountAmount = (product.price * product.discount) / 100;
    return product.price - discountAmount;
  };
  
  const discountedPrice = calculateDiscountedPrice();
  
  const getBrandColor = () => {
    const brandColors = {
      'Omega': 'blue',
      'Casio': 'green',
      'Apple': 'cyan',
      'Seiko': 'purple',
      'Rolex': 'gold',
    };
    
    return brandColors[product.brand] || 'default';
  };

  return (
    <div className="product-info pl-0 md:pl-6">
      <Title level={2}>{product.name}</Title>
      
      <div className="flex items-center mb-4 flex-wrap">
        <Rate allowHalf disabled value={product.rating || 4.5} className="text-lg mr-2" />
        <Text className="text-gray-500 mr-4">({product.reviews || 0} đánh giá)</Text>
        <Tag color={product.inStock ? 'success' : 'error'} className="mr-2">
          {product.inStock ? 'Còn hàng' : 'Hết hàng'}
        </Tag>
        <Tag color={getBrandColor()} className="text-sm">
          {product.brand}
        </Tag>
      </div>
      
      <div className="mb-5">
        {discountedPrice ? (
          <div className="flex items-center">
            <Text className="text-3xl font-bold text-verdigris-600 mr-3">
              {discountedPrice.toLocaleString("de-DE")} VNĐ
            </Text>
            <Text delete className="text-xl text-gray-500">
              {product.price.toLocaleString("de-DE")} VNĐ
            </Text>
            <Tag color="red" className="ml-3">-{product.discount}%</Tag>
          </div>
        ) : (
          <Text className="text-3xl font-bold text-verdigris-600">
            {product.price.toLocaleString("de-DE")} VNĐ
          </Text>
        )}
      </div>
      
      <Paragraph className="text-lg mb-5 text-gray-700 max-w-2xl">
        {product.shortDescription || product.description.substring(0, 150) + '...'}
      </Paragraph>
      
      <Divider />
      
      {/* Quantity & Add to cart */}
      <div className="mb-6">
        <Text className="block mb-2">Số lượng:</Text>
        <div className="flex items-center">
          <InputNumber
            min={1}
            max={product.inStock ? 10 : 0}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={!product.inStock}
            className="mr-4"
            size="large"
          />
          <Space size="middle">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-verdigris-500 hover:bg-verdigris-600"
            >
              Thêm vào giỏ
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={handleBuyNow}
              disabled={!product.inStock}
              danger
            >
              Mua ngay
            </Button>
          </Space>
        </div>
      </div>
      
      <Divider />
      
      {/* Short info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-start mb-3">
          <SafetyCertificateOutlined className="text-verdigris-500 text-lg mt-1 mr-2" />
          <div>
            <Text strong className="block">Bảo hành chính hãng</Text>
            <Text className="text-gray-600">12 tháng bảo hành toàn cầu</Text>
          </div>
        </div>
        <div className="flex items-start">
          <ClockCircleOutlined className="text-verdigris-500 text-lg mt-1 mr-2" />
          <div>
            <Text strong className="block">Giao hàng miễn phí</Text>
            <Text className="text-gray-600">Đơn hàng từ 1.000.000 VNĐ</Text>
          </div>
        </div>
      </div>
      
      {/* SKU & Categories */}
      <div className="text-gray-600">
        <Text className="block mb-1">SKU: WS-{product.id.padStart(4, '0')}</Text>
        <Text className="block">
          Danh mục: <a href={`/products?category=${product.category}`} className="text-verdigris-500 hover:text-verdigris-600 hover:no-underline">
            {product.category === 'mechanical' ? 'Đồng hồ cơ' : 
             product.category === 'smart' ? 'Đồng hồ thông minh' : 
             product.category === 'sport' ? 'Đồng hồ thể thao' : 'Đồng hồ cổ điển'}
          </a>
        </Text>
      </div>
    </div>
  );
};

export default ProductInfo;