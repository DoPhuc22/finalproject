import React from 'react';
import { Card, InputNumber, Button, Typography, Space, Image, Popconfirm, Tooltip, Alert } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const CartItem = ({ item, onUpdateQuantity, onRemove, loading }) => {
  // Debug log chi tiết
  console.log('CartItem received item:', JSON.stringify(item, null, 2));

  if (!item) {
    return (
      <Alert
        message="Lỗi hiển thị sản phẩm"
        description="Không thể tải thông tin sản phẩm này."
        type="warning"
        showIcon
      />
    );
  }

  const { product, quantity, itemId, productId } = item;
  
  if (!product || !product.name || product.name === 'Unknown Product') {
    return (
      <Alert
        message="Thiếu thông tin sản phẩm"
        description={
          <div>
            <p>Không thể tải thông tin sản phẩm với ID: {productId}</p>
            <details>
              <summary>Chi tiết lỗi:</summary>
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </details>
          </div>
        }
        type="error"
        showIcon
      />
    );
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(itemId);
  };

  const productPrice = product.price || 0;
  const totalPrice = productPrice * quantity;
  const productImage = product.imageUrl || '/assets/images/products/default.jpg';
  const productIdForLink = product.id || product.productId;

  return (
    <Card className="mb-4" bodyStyle={{ padding: '16px' }}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/products/${productIdForLink}`}>
            <Image
              src={productImage}
              alt={product.name}
              width={120}
              height={120}
              className="object-cover rounded-lg"
              preview={false}
              fallback="/assets/images/products/default.jpg"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-grow mb-4 md:mb-0">
              <Link to={`/products/${productIdForLink}`}>
                <Title level={5} className="mb-2 hover:text-blue-600">
                  {product.name}
                </Title>
              </Link>
              
              <div className="mb-2">
                <Text type="secondary">SKU: {product.sku || 'N/A'}</Text>
              </div>
              
              <div className="mb-2">
                <Text strong className="text-lg text-red-600">
                  {productPrice.toLocaleString('vi-VN')} VNĐ
                </Text>
              </div>

              {product.remainQuantity <= 5 && product.remainQuantity > 0 && (
                <Text type="warning" className="text-sm">
                  Chỉ còn {product.remainQuantity} sản phẩm
                </Text>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col items-end space-y-3">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  icon={<MinusOutlined />}
                  size="small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || loading}
                />
                
                <InputNumber
                  min={1}
                  max={product.remainQuantity || 999}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center"
                  disabled={loading}
                />
                
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.remainQuantity || 999) || loading}
                />
              </div>

              {/* Total Price */}
              <div className="text-right">
                <Text strong className="text-lg">
                  {totalPrice.toLocaleString('vi-VN')} VNĐ
                </Text>
              </div>

              {/* Remove Button */}
              <Popconfirm
                title="Xóa sản phẩm"
                description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                onConfirm={handleRemove}
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
              >
                <Tooltip title="Xóa sản phẩm">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    loading={loading}
                    className="hover:bg-red-50"
                  >
                    Xóa
                  </Button>
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;