import React from 'react';
import { 
  Layout, 
  Button, 
  Typography, 
  Dropdown, 
  Badge, 
  Avatar 
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = ({ collapsed, toggleCollapsed, notificationItems }) => {
  // User dropdown items
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

  return (
    <Header 
      className="bg-white p-0 shadow-sm flex items-center justify-between z-1" 
      style={{ position: 'sticky', top: 0, height: 64, paddingLeft: 16, paddingRight: 16 }}
    >
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
  );
};

export default AdminHeader;