// components/customer/Products/ProductCard.jsx
import React from "react";
import { Card, Badge, Rate, Button, Tag, Tooltip, message } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    // Logic thêm vào giỏ hàng sẽ được thêm sau
    message.success(<span>Đã thêm "{product.name}" vào giỏ hàng</span>);
  };

  const getStockStatus = () => {
    const inStock = product.remainQuantity > 0;
    if (inStock) {
      return <Tag color="success">Còn hàng</Tag>;
    }
    return <Tag color="error">Hết hàng</Tag>;
  };

  const getBrandTag = () => {
    const brandColors = {
      ricons: "blue",
      Casio: "green",
      Apple: "cyan",
      Seiko: "purple",
      Rolex: "gold",
      default: "red"
    };

    const brandName = typeof product.brand === 'object' 
      ? product.brand.name 
      : product.brand;

    return <Tag color={brandColors[brandName] || "default"}>{brandName}</Tag>;
  };

  const productId = product.id || product.productId;
  const imageUrl = product.imageUrl || '/assets/images/products/default.jpg';
  const discount = product.discount || 0;
  const price = product.price || 0;
  const discountedPrice = discount > 0 ? price - (price * discount / 100) : null;

  const cardActions = [
    <Tooltip title="Xem chi tiết">
      <Link to={`/products/${productId}`}>
        <Button
          type="text"
          icon={<EyeOutlined />}
          className="text-blue-500"
        />
      </Link>
    </Tooltip>,
    <Tooltip title="Thêm vào giỏ hàng">
      <Button
        type="text"
        icon={<ShoppingCartOutlined />}
        onClick={handleAddToCart}
        className="text-green-500"
        disabled={product.remainQuantity <= 0}
      />
    </Tooltip>,
  ];

  return (
    <Badge.Ribbon
      text={discount > 0 ? `Giảm ${discount}%` : null}
      color="red"
      style={{ display: discount > 0 ? "block" : "none" }}
    >
      <Card
        hoverable
        cover={
          <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              alt={product.name}
              src={imageUrl}
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/images/products/default.jpg";
              }}
            />
          </div>
        }
        actions={cardActions}
        className="product-card h-full"
      >
        <Meta
          title={
            <Link
              to={`/products/${productId}`}
              className="text-gray-800 hover:text-blue-600 hover:no-underline line-clamp-2 h-12"
            >
              {product.name}
            </Link>
          }
          description={
            <div>
              <p className="text-gray-500 mb-2 text-sm line-clamp-2">
                {product.description || "Không có mô tả"}
              </p>
              <div className="flex items-center mb-2">
                {getBrandTag()}
                {getStockStatus()}
              </div>
              
              <div className="price-section">
                {discountedPrice ? (
                  <div className="flex items-center">
                    <span className="text-gray-500 line-through mr-2">
                      {price.toLocaleString()} VNĐ
                    </span>
                    <span className="font-bold text-red-500">
                      {discountedPrice.toLocaleString()} VNĐ
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-800 text-xl">
                    {price.toLocaleString()} VNĐ
                  </span>
                )}
              </div>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;