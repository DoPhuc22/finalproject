import React from "react";
import { Layout, Button, Typography, Dropdown, Badge, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = ({ collapsed, toggleCollapsed, notificationItems }) => {
  // User dropdown items
  const userMenuItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          <span>Thông tin cá nhân</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center">
          <SettingOutlined className="mr-2" />
          <span>Cài đặt</span>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
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
      className="bg-white border-b border-slate-200 shadow-sm p-0 flex items-center justify-between z-50"
      style={{
        position: "sticky",
        top: 0,
        height: 64,
        paddingLeft: 16,
        paddingRight: 24,
      }}
    >
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="mr-4 text-gray-600 hover:text-gray-800"
          style={{ fontSize: "16px", width: 40, height: 40 }}
        />

        <div className="bg-slate-50 rounded-full hidden md:flex items-center px-4 py-2 ml-4">
          <SearchOutlined className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent border-0 outline-none text-sm py-1 w-64 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Dropdown
          menu={{
            items: notificationItems,
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge count={3} className="cursor-pointer">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              className="text-gray-600 hover:text-gray-800"
              style={{ fontSize: "16px", width: 40, height: 40 }}
            />
          </Badge>
        </Dropdown>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center cursor-pointer hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors">
            <Avatar className="bg-blue-500">A</Avatar>
            <div className="ml-3 hidden md:block">
              <Text strong className="text-gray-800">
                Admin
              </Text>
              <DownOutlined className="ml-2 text-xs text-gray-500" />
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;
