import React from 'react';
import { Card, Typography, Divider, Button, Space } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const CartSummary = ({ subtotal, shippingFee, total, itemCount, loading }) => {
  return (
    <Card title="Tóm tắt đơn hàng" className="sticky top-4">
      <Space direction="vertical" className="w-full" size="middle">
        {/* Order Details */}
        <div>
          <div className="flex justify-between mb-2">
            <Text>Tạm tính ({itemCount} sản phẩm):</Text>
            <Text>{subtotal.toLocaleString('vi-VN')} VNĐ</Text>
          </div>
          
          <div className="flex justify-between mb-2">
            <Text>Phí vận chuyển:</Text>
            <Text className="text-green-600">
              {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} VNĐ`}
            </Text>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Total */}
        <div className="flex justify-between">
          <Title level={4} className="mb-0">Tổng thanh toán:</Title>
          <Title level={4} className="mb-0 text-red-600">
            {total.toLocaleString('vi-VN')} VNĐ
          </Title>
        </div>

        <Divider className="my-3" />

        {/* Action Buttons */}
        <Space direction="vertical" className="w-full" size="small">
          <Link to="/checkout" className="w-full">
            <Button
              type="primary"
              size="large"
              icon={<CreditCardOutlined />}
              className="w-full bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              disabled={itemCount === 0 || loading}
            >
              Tiến hành thanh toán
            </Button>
          </Link>
          
          <Link to="/products" className="w-full">
            <Button
              size="large"
              icon={<ShoppingCartOutlined />}
              className="w-full"
            >
              Tiếp tục mua sắm
            </Button>
          </Link>
        </Space>

        {/* Additional Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text type="secondary" className="text-sm">
            • Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ
            <br />
            • Hỗ trợ đổi trả trong 7 ngày
            <br />
            • Thanh toán an toàn và bảo mật
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default CartSummary;