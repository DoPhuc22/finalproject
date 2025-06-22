// components/customer/Products/Detail/ProductInfo.jsx
import React, { useState } from "react";
import {
  Typography,
  Rate,
  Tag,
  Divider,
  Button,
  InputNumber,
  Space,
  message,
  Tooltip,
} from "antd";
import {
  HeartOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Kiểm tra xem sản phẩm có còn hàng không
  const inStock = product.remainQuantity > 0;

  const handleAddToCart = () => {
    if (!inStock) {
      message.error("Sản phẩm hiện đang hết hàng");
      return;
    }

    // Ở đây sau này bạn sẽ thêm logic để gọi API thêm vào giỏ hàng
    message.success(
      <span>
        Đã thêm {quantity} {product.name} vào giỏ hàng
      </span>
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Chuyển đến trang thanh toán
    window.location.href = "/checkout";
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

  // Lấy màu cho tag thương hiệu
  const getBrandColor = () => {
    const brandColors = {
      'Omega': 'blue',
      'Casio': 'green',
      'Apple': 'cyan',
      'Seiko': 'purple',
      'Rolex': 'gold',
    };
    
    const brandName = typeof product.brand === 'object' 
      ? product.brand.name 
      : product.brand;
      
    return brandColors[brandName] || 'default';
  };

  // Lấy tên thương hiệu
  const getBrandName = () => {
    return typeof product.brand === 'object' 
      ? product.brand.name 
      : product.brand;
  };

  return (
    <div className="product-info">
      <Title level={2} className="mb-2">
        {product.name}
      </Title>
      
      <div className="flex items-center gap-4 mb-4">
        <Space>
          <Rate disabled defaultValue={product.rating || 4.5} allowHalf />
          <Text className="text-gray-500">
            ({product.reviewCount || 0} đánh giá)
          </Text>
        </Space>
        
        <Tag color={getBrandColor()}>
          {getBrandName()}
        </Tag>
        
        <Tag color={inStock ? 'success' : 'error'}>
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </Tag>
      </div>
      
      <Divider />
      
      <div className="price-block mb-6">
        {discountedPrice ? (
          <>
            <Text delete className="text-gray-500 text-xl">
              {product.price.toLocaleString()} VNĐ
            </Text>
            <Title level={3} className="text-red-500 m-0">
              {discountedPrice.toLocaleString()} VNĐ
            </Title>
            <Tag color="red" className="mt-1">
              Giảm {product.discount}%
            </Tag>
          </>
        ) : (
          <Title level={3} className="m-0">
            {product.price?.toLocaleString()} VNĐ
          </Title>
        )}
      </div>
      
      {product.description && (
        <Paragraph className="text-gray-600 mb-6">
          {product.description}
        </Paragraph>
      )}
      
      <Divider />
      
      <div className="quantity-block mb-6">
        <Text strong className="mb-2 block">Số lượng:</Text>
        <Space>
          <InputNumber
            min={1}
            max={product.remainQuantity || 10}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={!inStock}
          />
          <Text type="secondary">
            {inStock ? `Còn ${product.remainQuantity} sản phẩm` : 'Hết hàng'}
          </Text>
        </Space>
      </div>
      
      <div className="action-buttons">
        <Space size="middle">
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            Thêm vào giỏ
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleBuyNow}
            disabled={!inStock}
          >
            Mua ngay
          </Button>
        </Space>
      </div>
      
      <Divider />
      
      <div className="extra-info">
        <Space direction="vertical" size="small">
          <div className="flex items-center">
            <SafetyCertificateOutlined className="mr-2 text-green-600" />
            <Text>Bảo hành chính hãng 12 tháng</Text>
          </div>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-blue-600" />
            <Text>Giao hàng dự kiến: 1-3 ngày</Text>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default ProductInfo;