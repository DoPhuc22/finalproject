// components/customer/Products/ProductCard.jsx
import React from "react";
import { Card, Badge, Rate, Button, Tag, Tooltip, message } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/slices/cartSlice";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      message.warning("Đăng nhập để tiếp tục mua hàng");
      navigate("/auth");
      return;
    }

    // Add to cart using Redux
    dispatch(
      addToCart({
        id: product.id || product.productId,
        name: product.name,
        price: product.price,
        image: product.imageUrl || "/assets/images/products/watch.jpg",
        brand: product.brand?.name || product.brand,
        quantity: 1,
      })
    );

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
      Omega: "blue",
      Casio: "green",
      Apple: "cyan",
      Seiko: "purple",
      Rolex: "gold",
    };

    const brandName = product.brand?.name || product.brand;

    return <Tag color={brandColors[brandName] || "default"}>{brandName}</Tag>;
  };

  const cardActions = [
    <Tooltip title="Xem chi tiết">
      <Link
        to={`/products/${product.id || product.productId}`}
        className="hover:no-underline"
      >
        <EyeOutlined key="view" />
      </Link>
    </Tooltip>,
    <Tooltip title="Thêm vào giỏ hàng">
      <ShoppingCartOutlined key="cart" onClick={handleAddToCart} />
    </Tooltip>,
  ];

  // Calculate sale price if discount exists
  const discountPercent = product.discount || 0;
  const hasDiscount = discountPercent > 0;

  return (
    <Badge.Ribbon
      text={hasDiscount ? `Giảm ${discountPercent}%` : null}
      color="red"
      style={{ display: hasDiscount ? "block" : "none" }}
    >
      <Card
        hoverable
        cover={
          <div className="relative h-60 overflow-hidden">
            <img
              alt={product.name}
              src={
                product.imageUrl ||
                product.image ||
                "/assets/images/products/watch.jpg"
              }
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.target.src = "/assets/images/products/watch.jpg";
              }}
            />
            <div className="absolute top-2 left-2 flex gap-1 z-10">
              {getStockStatus()}
              {getBrandTag()}
            </div>
          </div>
        }
        actions={cardActions}
        className="product-card h-full"
      >
        <Meta
          title={
            <Link
              to={`/products/${product.id || product.productId}`}
              className="text-lg font-medium hover:text-verdigris-500 hover:no-underline"
            >
              {product.name}
            </Link>
          }
          description={
            <div>
              <div className="mb-2">
                <Rate
                  allowHalf
                  disabled
                  defaultValue={product.rating || 4.5}
                  className="text-sm"
                />
                <span className="text-xs ml-1 text-gray-500">
                  ({product.reviews || 0} đánh giá)
                </span>
              </div>
              <p className="text-gray-500 mb-2 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-verdigris-600">
                  {product.price?.toLocaleString("vi-VN") || 0} VNĐ
                </span>
                <Button
                  type="primary"
                  shape="round"
                  onClick={handleAddToCart}
                  disabled={!(product.remainQuantity > 0)}
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
