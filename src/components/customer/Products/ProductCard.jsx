import React from 'react';
import { Card, Badge, Rate, Button, Tag, Tooltip, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
      brand: product.brand,
      quantity: 1
    }));
    message.success(
  <span style={{ fontSize: '25px', textAlign: 'right' }}>
    Đã thêm "{product.name}" vào giỏ hàng
  </span>
);

  };

  const getStockStatus = () => {
    if (product.inStock) {
      return <Tag color="success">Còn hàng</Tag>;
    }
    return <Tag color="error">Hết hàng</Tag>;
  };

  const getBrandTag = () => {
    const brandColors = {
      'Omega': 'blue',
      'Casio': 'green',
      'Apple': 'cyan',
      'Seiko': 'purple',
      'Rolex': 'gold',
    };
    
    return <Tag color={brandColors[product.brand] || 'default'}>{product.brand}</Tag>;
  };

  const cardActions = [
    <Tooltip title="Xem chi tiết">
      <Link to={`/products/${product.id}`} className='hover:no-underline'>
        <EyeOutlined key="view" />
      </Link>
    </Tooltip>,
    <Tooltip title="Thêm vào giỏ hàng">
      <ShoppingCartOutlined key="cart" onClick={handleAddToCart} />
    </Tooltip>,
  ];

  return (
    <Badge.Ribbon 
      text={product.discount ? `Giảm ${product.discount}%` : null} 
      color="red"
      style={{ display: product.discount ? 'block' : 'none' }}
    >
      <Card
        hoverable
        cover={
          <div className="relative h-90 overflow-hidden">
            <img 
              alt={product.name}
              src={product.imageUrl || product.image || '/assets/images/products/watch.jpg'}
              className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              onError={(e) => e.target.src = '/assets/images/products/watch.jpg'}
            />
            <div className="absolute top-2 left-2 flex gap-1">
              {getStockStatus()}
              {getBrandTag()}
            </div>
          </div>
        }
        actions={cardActions}
        className="product-card h-full"
      >
        <Meta
          title={<Link to={`/products/${product.id}`} className="text-lg font-medium hover:text-verdigris-500 hover:no-underline">{product.name}</Link>}
          description={
            <div>
              <div className="mb-2">
                <Rate allowHalf disabled defaultValue={product.rating || 4.5} className="text-sm" />
                <span className="text-xs ml-1 text-gray-500">({product.reviews || 0} đánh giá)</span>
              </div>
              <p className="text-gray-500 mb-2 text-sm line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-verdigris-600">{product.price?.toLocaleString('de-DE') || 0} VNĐ</span>
                <Button 
                  type="primary" 
                  shape="round" 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
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