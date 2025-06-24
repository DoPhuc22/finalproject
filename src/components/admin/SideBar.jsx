import React from "react";
import { Layout, Menu, Button, Typography } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  TrademarkOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Tổng quan</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Sản phẩm</Link>,
    },
    {
      key: "/admin/categories",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/admin/categories">Danh mục</Link>,
    },
    {
      key: "/admin/brands",
      icon: <TrademarkOutlined />,
      label: <Link to="/admin/brands">Nhãn hàng</Link>,
    },
    {
      key: "/admin/attribute_types",
      icon: <TagOutlined />,
      label: <Link to="/admin/attribute_types">Loại thuộc tính</Link>,
    },
      {
      key: "/admin/attribute_values",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/attribute_values">Giá trị thuộc tính</Link>,
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Đơn hàng</Link>,
      disabled: true
    },
    {
      key: "/admin/customers",
      icon: <UserOutlined />,
      label: <Link to="/admin/customers">Khách hàng</Link>,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt</Link>,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      className="shadow-md"
      width={250}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        borderRight: "1px solid #f0f0f0",
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
              e.target.src =
                "https://via.placeholder.com/32x32/3AA1A0/FFFFFF?text=WS";
            }}
          />
          {!collapsed && (
            <Title level={4} className="m-0 text-verdigris-500 mt-3">
              Admin Panel
            </Title>
          )}
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="border-0 mt-2"
        items={menuItems}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          danger
          block
          className="flex items-center justify-center"
        >
          {!collapsed && (
            <span className="ml-2">
              <Link
                to="/admin/login"
                className="text-white hover:no-underline hover:text-red-100"
              >
                Đăng xuất
              </Link>
            </span>
          )}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
