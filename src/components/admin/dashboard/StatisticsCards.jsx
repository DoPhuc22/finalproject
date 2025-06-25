import React from 'react';
import { Row, Col, Card, Statistic, Tag, Typography } from 'antd';
import { 
  RiseOutlined, 
  ShoppingCartOutlined, 
  InboxOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const StatisticsCards = ({ stats }) => {
  // Debug dữ liệu đến
  console.log('StatisticsCards received stats:', stats);
  
  // Kiểm tra nếu stats rỗng hoặc không phải object
  if (!stats || typeof stats !== 'object') {
    console.warn('StatisticsCards received invalid stats:', stats);
    stats = {
      revenue: { today: 0, yesterday: 0, percent: 0 },
      orders: { today: 0, yesterday: 0, percent: 0 },
      productsSold: { today: 0, yesterday: 0, percent: 0 },
      newUsers: { today: 0, yesterday: 0, percent: 0 }
    };
  }

  // Extract data from stats
  const revenue = stats.revenue || { today: 0, yesterday: 0, percent: 0 };
  const orders = stats.orders || { today: 0, yesterday: 0, percent: 0 };
  const productsSold = stats.productsSold || { today: 0, yesterday: 0, percent: 0 };
  const newUsers = stats.newUsers || { today: 0, yesterday: 0, percent: 0 };

  const getTagColor = (value) => {
    if (value > 0) return 'success';
    if (value < 0) return 'error';
    return 'default';
  };

  return (
    <Row gutter={[16, 16]} className='z-40'>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm h-full">
          <Statistic
            title="Doanh thu hôm nay"
            value={revenue.today || 0}
            precision={0}
            valueStyle={{ color: '#3AA1A0' }}
            prefix={<RiseOutlined />}
            suffix="VNĐ"
            formatter={(value) => `${value.toLocaleString()}`}
          />
          <div className="mt-2">
            <Tag color={getTagColor(revenue.percent)}>
              {revenue.percent > 0 ? '+' : ''}{revenue.percent}%
            </Tag>
            <Text type="secondary" className="text-xs">So với hôm qua</Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm h-full">
          <Statistic
            title="Đơn hàng hôm nay"
            value={orders.today || 0}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ShoppingCartOutlined />}
          />
          <div className="mt-2">
            <Tag color={getTagColor(orders.percent)}>
              {orders.percent > 0 ? '+' : ''}{orders.percent}%
            </Tag>
            <Text type="secondary" className="text-xs">So với hôm qua</Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm h-full">
          <Statistic
            title="Sản phẩm đã bán"
            value={productsSold.today || 0}
            valueStyle={{ color: '#1890ff' }}
            prefix={<InboxOutlined />}
          />
          <div className="mt-2">
            <Tag color={getTagColor(productsSold.percent)}>
              {productsSold.percent > 0 ? '+' : ''}{productsSold.percent}%
            </Tag>
            <Text type="secondary" className="text-xs">So với hôm qua</Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm h-full">
          <Statistic
            title="Khách hàng mới"
            value={newUsers.today || 0}
            valueStyle={{ color: '#cf1322' }}
            prefix={<UserOutlined />}
          />
          <div className="mt-2">
            <Tag color={getTagColor(newUsers.percent)}>
              {newUsers.percent > 0 ? '+' : ''}{newUsers.percent}%
            </Tag>
            <Text type="secondary" className="text-xs">So với hôm qua</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards;