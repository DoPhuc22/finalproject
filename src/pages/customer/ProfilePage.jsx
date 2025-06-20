import React, { useState, useEffect } from "react";
import { Layout, Typography, message, Breadcrumb, Spin } from "antd";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { isAuthenticated, getCurrentUser } from "../../services/auth";
import ProfileSidebar from "../../components/customer/Profile/ProfileSidebar";
import AccountInfo from "../../components/customer/Profile/AccountInfo";
import OrderHistory from "../../components/customer/Profile/OrderHistory";
import PasswordChange from "../../components/customer/Profile/PasswordChange";

const { Content } = Layout;
const { Title } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      console.log("Checking authentication");

      // Check if user is authenticated
      const isAuth = isAuthenticated();
      console.log("Is authenticated:", isAuth);

      if (!isAuth) {
        message.warning("Vui lòng đăng nhập để truy cập trang này");
        navigate("/auth", { state: { from: location } });
        return false;
      }

      // Lấy thông tin người dùng
      const user = getCurrentUser();
      console.log("Current user from localStorage:", user);

      if (!user) {
        message.error(
          "Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại"
        );
        navigate("/auth", { state: { from: location } });
        return false;
      }

      // Kiểm tra user.id
      if (!user.id && !user.userId && !user._id) {
        // Nếu không có ID, tạo ID tạm thời
        user.id = Date.now().toString();
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Created temporary ID for user:", user);
      }

      // Đảm bảo user có ID
      if (!user.id) {
        if (user.userId) user.id = user.userId;
        else if (user._id) user.id = user._id;

        // Cập nhật localStorage với id đã được khôi phục
        localStorage.setItem("user", JSON.stringify(user));
      }

      setCurrentUser(user);
      return true;
    };

    if (checkAuth()) {
      setLoading(false);
    }
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Breadcrumb className="container mx-auto px-4 py-4">
        <Breadcrumb.Item>
          <Link to="/" className="hover:text-verdigris-500">
            <HomeOutlined className="mr-1" />
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Tài khoản của tôi</Breadcrumb.Item>
      </Breadcrumb>

      <div className="container mx-auto px-4 py-6">
        <Title level={3} className="mb-6">
          Tài khoản của tôi
        </Title>

        <Layout className="bg-transparent">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar location={location} />

            <Content className="bg-white shadow-sm rounded-lg p-6 w-full">
              <Routes>
                <Route path="/" element={<AccountInfo user={currentUser} />} />
                <Route
                  path="/password"
                  element={<PasswordChange user={currentUser} />}
                />
                <Route
                  path="/orders"
                  element={<OrderHistory user={currentUser} />}
                />
              </Routes>
            </Content>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default ProfilePage;
