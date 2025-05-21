import React, { useState } from 'react';
import { 
  Layout, 
  Breadcrumb, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Checkbox, 
  Divider 
} from 'antd';
import { Link } from 'react-router-dom';
import { 
  RiseOutlined, 
  ShoppingCartOutlined, 
  InboxOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import getNotificationItems from '../../components/admin/NotificationItems';
import AdminHeader from '../../components/admin/Header';
import Sidebar from '../../components/admin/SideBar';

const { Content } = Layout;
const { Title, Text } = Typography;

// Mock data for orders
const recentOrders = [
  {
    key: '1',
    order: 'WS-3245',
    customer: 'Nguyễn Văn A',
    status: 'Completed',
    total: 2540000,
    date: '2025-05-12'
  },
  {
    key: '2',
    order: 'WS-3246',
    customer: 'Trần Thị B',
    status: 'Pending',
    total: 1890000,
    date: '2025-05-12'
  },
  {
    key: '3',
    order: 'WS-3247',
    customer: 'Lê Văn C',
    status: 'Processing',
    total: 3650000,
    date: '2025-05-11'
  },
  {
    key: '4',
    order: 'WS-3248',
    customer: 'Phạm Thị D',
    status: 'Cancelled',
    total: 780000,
    date: '2025-05-11'
  },
  {
    key: '5',
    order: 'WS-3249',
    customer: 'Hoàng Văn E',
    status: 'Completed',
    total: 4250000,
    date: '2025-05-10'
  },
];

// Table columns
const columns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'order',
    key: 'order',
    render: (text) => <a className="text-verdigris-500">{text}</a>,
  },
  {
    title: 'Khách hàng',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Ngày đặt',
    dataIndex: 'date',
    render: (date) => new Date(date).toLocaleDateString('vi-VN', {  
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    key: 'date',
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'total',
    key: 'total',
    render: (total) => `${total.toLocaleString()} VNĐ`,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status) => {
      let color;
      switch(status) {
        case 'Completed':
          color = 'success';
          break;
        case 'Pending':
          color = 'warning';
          break;
        case 'Processing':
          color = 'processing';
          break;
        case 'Cancelled':
          color = 'error';
          break;
        default:
          color = 'default';
      }
      return (
        <Tag color={color}>
          {status}
        </Tag>
      );
    },
  },
];

const AdminDashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Lấy dữ liệu thông báo
  const notificationItems = getNotificationItems();

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
      
      <Layout className="min-h-screen" style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <AdminHeader 
          collapsed={collapsed} 
          toggleCollapsed={toggleCollapsed} 
          notificationItems={notificationItems} 
          className="z-50"
        />
        
        <Content className="m-4 p-4 bg-white rounded-lg">
          {/* Dashboard Content Start */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Tổng quan</Breadcrumb.Item>
          </Breadcrumb>
          
          <div className="mb-6">
            <Title level={3} className="mb-0">Dashboard</Title>
            <Text type="secondary">Chào mừng trở lại, Admin</Text>
          </div>
          
          <Row gutter={[16, 16]} className='z-40'>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm h-full">
                <Statistic
                  title="Doanh thu hôm nay"
                  value={12500000}
                  precision={0}
                  valueStyle={{ color: '#3AA1A0' }}
                  prefix={<RiseOutlined />}
                  suffix="VNĐ"
                  formatter={(value) => `${value.toLocaleString()}`}
                />
                <div className="mt-2">
                  <Tag color="success">+12.5%</Tag>
                  <Text type="secondary" className="text-xs">So với hôm qua</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm h-full">
                <Statistic
                  title="Đơn hàng hôm nay"
                  value={24}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<ShoppingCartOutlined />}
                />
                <div className="mt-2">
                  <Tag color="success">+8.4%</Tag>
                  <Text type="secondary" className="text-xs">So với hôm qua</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm h-full">
                <Statistic
                  title="Sản phẩm đã bán"
                  value={48}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<InboxOutlined />}
                />
                <div className="mt-2">
                  <Tag color="warning">-2.3%</Tag>
                  <Text type="secondary" className="text-xs">So với hôm qua</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm h-full">
                <Statistic
                  title="Khách hàng mới"
                  value={12}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<UserOutlined />}
                />
                <div className="mt-2">
                  <Tag color="error">-5.1%</Tag>
                  <Text type="secondary" className="text-xs">So với hôm qua</Text>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} lg={16}>
              <Card 
                title="Đơn hàng gần đây" 
                bordered={false} 
                className="shadow-sm"
                extra={<Link to="/admin/orders" className="text-verdigris-500">Xem tất cả</Link>}
              >
                <Table 
                  columns={columns} 
                  dataSource={recentOrders} 
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card 
                title="Thống kê sản phẩm" 
                bordered={false} 
                className="shadow-sm"
                extra={<Link to="/admin/products" className="text-verdigris-500">Chi tiết</Link>}
              >
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Text>Đồng hồ cơ</Text>
                    <Text type="secondary">68%</Text>
                  </div>
                  <Progress percent={68} strokeColor="#3AA1A0" />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Text>Đồng hồ thông minh</Text>
                    <Text type="secondary">45%</Text>
                  </div>
                  <Progress percent={45} strokeColor="#3AA1A0" />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Text>Đồng hồ thể thao</Text>
                    <Text type="secondary">32%</Text>
                  </div>
                  <Progress percent={32} strokeColor="#3AA1A0" />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Text>Đồng hồ cổ điển</Text>
                    <Text type="secondary">88%</Text>
                  </div>
                  <Progress percent={88} strokeColor="#3AA1A0" />
                </div>
              </Card>
              
              {/* <Card 
                title="Nhiệm vụ hôm nay" 
                bordered={false} 
                className="shadow-sm mt-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Checkbox />
                    <Text className="ml-2">Cập nhật tồn kho</Text>
                    <Tag color="warning" className="ml-auto">Đang chờ</Tag>
                  </div>
                  
                  <Divider className="my-2" />
                  
                  <div className="flex items-center">
                    <Checkbox checked />
                    <Text className="ml-2" delete>Duyệt đơn hàng mới</Text>
                    <Tag color="success" className="ml-auto">Hoàn thành</Tag>
                  </div>
                  
                  <Divider className="my-2" />
                  
                  <div className="flex items-center">
                    <Checkbox />
                    <Text className="ml-2">Chuẩn bị khuyến mãi tháng 6</Text>
                    <Tag color="processing" className="ml-auto">Đang thực hiện</Tag>
                  </div>
                </div>
              </Card> */}
            </Col>
          </Row>
          {/* Dashboard Content End */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardPage;