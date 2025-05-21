import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed, onCollapse }) => {
  return (
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
          {!collapsed && <span className="ml-2"><Link to={'../admin/login'} className='text-white hover:no-underline hover:text-red-100'>Đăng xuất</Link></span>}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;