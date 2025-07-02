import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import useCart from "../../../../hooks/useCart";

const { Title, Text, Paragraph } = Typography;

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const {
    addItemToCart,
    loading: cartLoading,
    isAuthenticated,
    currentUser,
  } = useCart();

  // Debug log để kiểm tra trạng thái
  useEffect(() => {
    console.log("ProductInfo - Auth status:", { isAuthenticated, currentUser });
  }, [isAuthenticated, currentUser]);

  // Kiểm tra xem sản phẩm có còn hàng không
  const inStock = product.remainQuantity > 0;

  const handleAddToCart = async () => {
    console.log("handleAddToCart - Auth check:", {
      isAuthenticated,
      currentUser,
    });

    if (!isAuthenticated || !currentUser) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/auth");
      return;
    }

    if (!inStock) {
      message.error("Sản phẩm hiện đang hết hàng");
      return;
    }

    const success = await addItemToCart(product, quantity);
    if (success) {
      setQuantity(1);
      message.success(
        <span className="text-2xl">Đã thêm {product.name} vào giỏ hàng</span>
      );
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated || !currentUser) {
      message.warning("Vui lòng đăng nhập để mua hàng");
      navigate("/auth");
      return;
    }

    if (!inStock) {
      message.error("Sản phẩm hiện đang hết hàng");
      return;
    }

    const success = await addItemToCart(product, quantity);
    if (success) {
      // Chuyển đến trang giỏ hàng
      navigate("/cart");
    }
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  // Lấy màu cho tag thương hiệu
  const getBrandColor = () => {
    const brandColors = {
      Omega: "blue",
      Casio: "green",
      Apple: "cyan",
      Seiko: "purple",
      Rolex: "gold",
      default: "default",
    };

    const brandName =
      typeof product.brand === "object" ? product.brand.name : product.brand;

    return brandColors[brandName] || brandColors.default;
  };

  return (
    <div className="product-info">
      {/* Product Name */}
      <Title level={2} className="mb-4">
        {product.name}
      </Title>

      {/* Brand and Category */}
      <div className="mb-4">
        <Space>
          <Tag color={getBrandColor()}>
            {typeof product.brand === "object"
              ? product.brand.name
              : product.brand}
          </Tag>
          <Tag>
            {typeof product.category === "object"
              ? product.category.name
              : product.category}
          </Tag>
          {product.sku && <Tag color="default">SKU: {product.sku}</Tag>}
        </Space>
      </div>

      {/* Price */}
      <div className="mb-6">
        <Space direction="vertical" size="small">
          <div>
            <Text className="text-3xl mr-2">
              {product.price.toLocaleString("vi-VN")} VNĐ
            </Text>
          </div>
        </Space>
      </div>

      {/* Stock Status */}
      <div className="mb-4">
        {inStock ? (
          <Tag color="success">✓ Còn hàng</Tag>
        ) : (
          <Tag color="error">Hết hàng</Tag>
        )}
      </div>

      {/* Quantity Selection */}
      <div className="mb-6">
        <Text strong className="block mb-2">
          Số lượng:
        </Text>
        <Space align="center">
          <InputNumber
            min={1}
            max={product.remainQuantity || 999}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={!inStock || cartLoading}
          />
          <Text type="secondary">
            {inStock ? `Còn ${product.remainQuantity} sản phẩm` : "Hết hàng"}
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
            loading={cartLoading}
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
            loading={cartLoading}
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
            <Text>Giao hàng nhanh 2-3 ngày</Text>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default ProductInfo;
