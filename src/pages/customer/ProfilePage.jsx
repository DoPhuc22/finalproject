import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Breadcrumb, message } from "antd";
import { 
  UserOutlined, 
  ShoppingOutlined, 
  HomeOutlined, 
  LockOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountInfo from "../../components/customer/Profile/AccountInfo";
import PasswordChange from "../../components/customer/Profile/PasswordChange";
import OrderHistory from "../../components/customer/Profile/OrderHistory";

const { Content, Sider } = Layout;
const { Title } = Typography;

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để truy cập trang này");
      navigate("/auth", { state: { from: location } });
    }

    // Set active tab based on URL
    const path = location.pathname;
    if (path.includes("/profile/orders")) {
      setActiveTab("orders");
    } else if (path.includes("/profile/password")) {
      setActiveTab("password");
    } else {
      setActiveTab("account");
    }
  }, [isAuthenticated, navigate, location]);

  const handleMenuClick = (e) => {
    setActiveTab(e.key);
    
    // Navigate to the corresponding path
    if (e.key === "account") {
      navigate("/profile");
    } else {
      navigate(`/profile/${e.key}`);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountInfo />;
      case "password":
        return <PasswordChange />;
      case "orders":
        return <OrderHistory />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-180px)] py-6">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/" className="hover:text-verdigris-500">
              <HomeOutlined className="mr-1" />
              Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Tài khoản của tôi</Breadcrumb.Item>
          <Breadcrumb.Item>
            {activeTab === "account" && "Thông tin tài khoản"}
            {activeTab === "password" && "Đổi mật khẩu"}
            {activeTab === "orders" && "Đơn hàng của tôi"}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Layout className="bg-transparent">
          <Sider
            width={280}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            collapsedWidth={0}
            trigger={null}
            className="bg-white shadow-sm rounded-lg overflow-hidden hidden md:block"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-verdigris-500 flex items-center justify-center text-white text-xl font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <Title level={5} className="m-0 text-ellipsis overflow-hidden whitespace-nowrap">
                    {user?.name || "Người dùng"}
                  </Title>
                  <div className="text-gray-500 text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
            
            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              onClick={handleMenuClick}
              className="border-r-0"
              items={[
                {
                  key: "account",
                  icon: <UserOutlined />,
                  label: "Thông tin tài khoản"
                },
                {
                  key: "password",
                  icon: <LockOutlined />,
                  label: "Đổi mật khẩu"
                },
                {
                  key: "orders",
                  icon: <ShoppingOutlined />,
                  label: "Đơn hàng của tôi"
                }
              ]}
            />
          </Sider>
          
          {/* Mobile menu */}
          <div className="md:hidden mb-4">
            <Menu
              mode="horizontal"
              selectedKeys={[activeTab]}
              onClick={handleMenuClick}
              className="rounded-lg overflow-x-auto whitespace-nowrap flex-nowrap"
              items={[
                {
                  key: "account",
                  icon: <UserOutlined />,
                  label: "Tài khoản"
                },
                {
                  key: "password",
                  icon: <LockOutlined />,
                  label: "Mật khẩu"
                },
                {
                  key: "orders",
                  icon: <ShoppingOutlined />,
                  label: "Đơn hàng"
                }
              ]}
            />
          </div>
          
          <Content className="bg-white shadow-sm rounded-lg p-6 md:ml-6">
            {renderContent()}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default ProfilePage;