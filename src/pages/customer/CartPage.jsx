import React, { useEffect } from 'react';
import { Row, Col, Typography, Button, Empty, Spin, Breadcrumb, Space, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import CartItem from '../../components/customer/Cart/CartItem';
import CartSummary from '../../components/customer/Cart/CartSummary';
import useCart from '../../hooks/useCart';

const { Title, Text } = Typography;

const CartPage = () => {
  const {
    cartItems,
    loading,
    subtotal,
    shippingFee,
    total,
    totalQuantity,
    updateItemQuantity,
    removeItemFromCart,
    clearEntireCart,
    fetchCart,
    isAuthenticated,
    currentUser
  } = useCart();

  // Debug logging
  useEffect(() => {
    console.log('CartPage - Debug info:', {
      isAuthenticated,
      currentUser,
      cartItems,
      totalQuantity,
      loading
    });
  }, [isAuthenticated, currentUser, cartItems, totalQuantity, loading]);

  useEffect(() => {
    // Refresh cart data when component mounts
    if (isAuthenticated && currentUser) {
      console.log('CartPage - Fetching cart data...');
      fetchCart();
    }
  }, [isAuthenticated, currentUser, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text className="text-lg mb-4 block">
                  Vui lòng đăng nhập để xem giỏ hàng
                </Text>
                <Link to="/auth">
                  <Button type="primary" size="large">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  if (loading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" tip="Đang tải giỏ hàng..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link to="/" className="hover:no-underline">
            <HomeOutlined className="mr-1" />
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ShoppingCartOutlined className="mr-1" />
          Giỏ hàng
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Debug info - có thể xóa sau khi fix */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <Text strong>Debug Info:</Text>
          <br />
          <Text>Auth: {isAuthenticated ? 'Yes' : 'No'}</Text>
          <br />
          <Text>User: {currentUser ? currentUser.name || currentUser.email : 'None'}</Text>
          <br />
          <Text>Cart Items: {cartItems.length}</Text>
          <br />
          <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">
          Giỏ hàng ({totalQuantity} sản phẩm)
        </Title>
        
        {cartItems.length > 0 && (
          <Popconfirm
            title="Xóa toàn bộ giỏ hàng"
            description="Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?"
            onConfirm={clearEntireCart}
            okText="Xóa tất cả"
            cancelText="Hủy"
            okType="danger"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              loading={loading}
            >
              Xóa tất cả
            </Button>
          </Popconfirm>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <div className="text-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text className="text-lg mb-4 block">
                  Giỏ hàng của bạn đang trống
                </Text>
                <Text type="secondary" className="mb-6 block">
                  Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
                </Text>
                <Link to="/products">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Bắt đầu mua sắm
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        /* Cart Content */
        <Row gutter={[24, 24]}>
          {/* Cart Items */}
          <Col xs={24} lg={16}>
            <div className="space-y-4">
              {cartItems.map((item) => {
                console.log('Rendering cart item:', item); // Debug log
                return (
                  <CartItem
                    key={item.itemId || item.id}
                    item={item}
                    onUpdateQuantity={updateItemQuantity}
                    onRemove={removeItemFromCart}
                    loading={loading}
                  />
                );
              })}
            </div>
          </Col>

          {/* Cart Summary */}
          <Col xs={24} lg={8}>
            <CartSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              itemCount={totalQuantity}
              loading={loading}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartPage;