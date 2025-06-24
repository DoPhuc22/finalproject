import React from "react";
import { Menu, Typography, Avatar } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  ShoppingOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ProfileSidebar = ({ user, location }) => {
  // Calculate current selected menu item
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/profile/orders")) return "orders";
    if (path.includes("/profile/password")) return "password";
    return "account";
  };

  return (
    <div className="w-full md:w-64 md:mr-6 mb-6 md:mb-0">
      <div className="bg-white p-4 shadow-sm rounded-lg mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            size={64}
            className="bg-verdigris-500 flex items-center justify-center"
          >
            {user?.name?.charAt(0)?.toUpperCase() || <UserOutlined />}
          </Avatar>
          <div>
            <Title level={5} className="m-0">
              {user?.name || "Người dùng"}
            </Title>
          </div>
        </div>
      </div>

      <Menu
        mode="vertical"
        selectedKeys={[getSelectedKey()]}
        className="bg-white shadow-sm rounded-lg overflow-hidden"
        items={[
          {
            key: "account",
            icon: <UserOutlined />,
            label: <Link to="/profile">Thông tin tài khoản</Link>,
          },
          {
            key: "password",
            icon: <LockOutlined />,
            label: <Link to="/profile/password">Đổi mật khẩu</Link>,
          },
          {
            key: "orders",
            icon: <ShoppingOutlined />,
            label: <Link to="/profile/orders">Đơn hàng của tôi</Link>,
          },
        ]}
      />
    </div>
  );
};

export default ProfileSidebar;
