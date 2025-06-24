import React, { useState } from "react";
import { Card, Badge, Rate, Button, Tag, Tooltip, message } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";

const { Meta } = Card;

const ProductCard = ({ product, onAddToCart, cartLoading }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/auth");
      return;
    }

    const inStock = product.remainQuantity > 0;
    if (!inStock) {
      message.error("Sản phẩm hiện đang hết hàng");
      return;
    }

    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product, 1);
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
    } finally {
      setIsAddingToCart(false);
    }
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
      Omega: "orange",
      default: "default"
    };
    
    const brandName = typeof product.brand === 'object' 
      ? product.brand.name 
      : product.brand;
      
    const color = brandColors[brandName] || brandColors.default;
    
    return <Tag color={color}>{brandName}</Tag>;
  };

  const productId = product.id || product.productId;
  const inStock = product.remainQuantity > 0;

  return (
    <Link to={`/products/${productId}`} className="product-card-link">
      <Badge.Ribbon 
        text={inStock ? "Còn hàng" : "Hết hàng"} 
        color={inStock ? "green" : "red"}
      >
        <Card
          hoverable
          className="product-card h-full"
          cover={
            <div className="product-image-container relative">
              <img
                alt={product.name}
                src={product.imageUrl || '/assets/images/products/default.jpg'}
                className="product-image w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/products/default.jpg';
                }}
              />
              <div className="product-overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  size="large"
                  className="mr-2"
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          }
          actions={[
            <Button
              key="addToCart"
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={!inStock}
              loading={isAddingToCart || cartLoading}
              className="w-full"
            >
              {inStock ? "Thêm vào giỏ" : "Hết hàng"}
            </Button>
          ]}
        >
          <Meta
            title={
              <div className="product-title">
                <Tooltip title={product.name}>
                  <span className="text-base font-medium line-clamp-2">
                    {product.name}
                  </span>
                </Tooltip>
              </div>
            }
            description={
              <div className="product-info space-y-2">
                <div className="flex justify-between items-center">
                  {getBrandTag()}
                  {getStockStatus()}
                </div>
                
                <div className="price-section">
                  <span className="text-red-600 font-bold text-lg">
                    {product.price?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                {product.remainQuantity <= 5 && product.remainQuantity > 0 && (
                  <div className="stock-warning">
                    <Tag color="warning" className="text-xs">
                      Chỉ còn {product.remainQuantity} sản phẩm
                    </Tag>
                  </div>
                )}
              </div>
            }
          />
        </Card>
      </Badge.Ribbon>
    </Link>
  );
};

export default ProductCard;