import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Avatar, 
  Breadcrumb,
  Dropdown,
  Badge,
  Progress,
  Checkbox,
  Divider
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Mock data
const recentOrders = [
  {
    key: '1',
    order: 'WS-3245',
    customer: 'Nguyễn Văn A',
    status: 'Completed',
    total: 2540000,
    date: '2023-05-12'
  },
  {
    key: '2',
    order: 'WS-3246',
    customer: 'Trần Thị B',
    status: 'Pending',
    total: 1890000,
    date: '2023-05-12'
  },
  {
    key: '3',
    order: 'WS-3247',
    customer: 'Lê Văn C',
    status: 'Processing',
    total: 3650000,
    date: '2023-05-11'
  },
  {
    key: '4',
    order: 'WS-3248',
    customer: 'Phạm Thị D',
    status: 'Cancelled',
    total: 780000,
    date: '2023-05-11'
  },
  {
    key: '5',
    order: 'WS-3249',
    customer: 'Hoàng Văn E',
    status: 'Completed',
    total: 4250000,
    date: '2023-05-10'
  },
];

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

const notificationItems = [
  {
    key: '1',
    label: (
      <div className="flex items-start py-2 px-1">
        <Badge status="processing" className="mt-1 mr-2" />
        <div>
          <Text strong>Đơn hàng mới #WS-3245</Text>
          <div>Khách hàng: Nguyễn Văn A</div>
          <div className="text-xs text-gray-500 mt-1">2 phút trước</div>
        </div>
      </div>
    ),
  },
  {
    key: '2',
    label: (
      <div className="flex items-start py-2 px-1">
        <Badge status="warning" className="mt-1 mr-2" />
        <div>
          <Text strong>Sản phẩm sắp hết hàng</Text>
          <div>Đồng hồ Seiko Presage - Còn 2 sản phẩm</div>
          <div className="text-xs text-gray-500 mt-1">1 giờ trước</div>
        </div>
      </div>
    ),
  },
  {
    key: '3',
    label: (
      <div className="flex items-start py-2 px-1">
        <Badge status="success" className="mt-1 mr-2" />
        <div>
          <Text strong>Đơn hàng đã hoàn thành</Text>
          <div>Đơn hàng #WS-3242 đã giao thành công</div>
          <div className="text-xs text-gray-500 mt-1">3 giờ trước</div>
        </div>
      </div>
    ),
  },
  {
    type: 'divider',
  },
  {
    key: '4',
    label: (
      <div className="text-center">
        <Text className="text-verdigris-500">Xem tất cả thông báo</Text>
      </div>
    ),
  },
];

const userMenuItems = [
  {
    key: '1',
    label: (
      <div className="flex items-center">
        <UserOutlined className="mr-2" />
        <span>Thông tin cá nhân</span>
      </div>
    ),
  },
  {
    key: '2',
    label: (
      <div className="flex items-center">
        <SettingOutlined className="mr-2" />
        <span>Cài đặt</span>
      </div>
    ),
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: (
      <div className="flex items-center text-red-500">
        <LogoutOutlined className="mr-2" />
        <span>Đăng xuất</span>
      </div>
    ),
  },
];

const AdminDashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        className="shadow-md"
        width={250}
        style={{ 
          overflow: 'auto', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          bottom: 0,
          zIndex: 10,
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div className="p-4 flex items-center justify-center">
          <div className="flex items-center">
            <img 
              src="/assets/images/logo.png" 
              alt="Watch Store Admin" 
              className="h-8 mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32x32/3AA1A0/FFFFFF?text=WS";
              }}
            />
            {!collapsed && (
              <Title level={4} className="m-0 text-verdigris-500">
                Admin Panel
              </Title>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          className="border-0 mt-2"
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Tổng quan',
            },
            {
              key: '2',
              icon: <ShoppingOutlined />,
              label: 'Sản phẩm',
              children: [
                {
                  key: '2.1',
                  label: 'Tất cả sản phẩm',
                },
                {
                  key: '2.2',
                  label: 'Thêm sản phẩm mới',
                },
                {
                  key: '2.3',
                  label: 'Danh mục',
                },
              ],
            },
            {
              key: '3',
              icon: <ShoppingCartOutlined />,
              label: 'Đơn hàng',
            },
            {
              key: '4',
              icon: <UserOutlined />,
              label: 'Khách hàng',
            },
            {
              key: '5',
              icon: <TagOutlined />,
              label: 'Khuyến mãi',
            },
            {
              key: '6',
              icon: <SettingOutlined />,
              label: 'Cài đặt',
            },
          ]}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button 
            type="primary" 
            icon={<LogoutOutlined />} 
            danger
            block
            className="flex items-center justify-center"
          >
            {!collapsed && <span className="ml-2">Đăng xuất</span>}
          </Button>
        </div>
      </Sider>
      
      <Layout className="min-h-screen" style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Header className="bg-white p-0 shadow-sm flex items-center justify-between z-1" style={{ position: 'sticky', top: 0, height: 64, paddingLeft: 16, paddingRight: 16 }}>
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className="mr-4"
            />
            <div className="bg-gray-100 rounded-full hidden md:flex items-center px-3 py-1">
              <SearchOutlined className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="bg-transparent border-0 outline-none text-sm py-1 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dropdown
              menu={{
                items: notificationItems,
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Badge count={3} className="cursor-pointer">
                <Button type="text" shape="circle" icon={<BellOutlined />} />
              </Badge>
            </Dropdown>
            
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar className="bg-verdigris-500">A</Avatar>
                <div className="ml-2 hidden md:block">
                  <Text strong>Admin</Text>
                  <DownOutlined className="ml-1 text-xs" />
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-4 p-4 bg-white rounded-lg">
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
          
          <Row gutter={[16, 16]}>
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
              
              <Card 
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
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardPage;