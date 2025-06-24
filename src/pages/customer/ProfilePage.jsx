import React, { useState, useEffect } from "react";
import { Layout, Typography, message, Breadcrumb, Spin } from "antd";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { isAuthenticated, getCurrentUser, getProfile } from "../../services/auth";
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
  
  // Tải dữ liệu người dùng một cách tích cực hơn
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication");
        setLoading(true);
        
        // Kiểm tra token trước
        const token = localStorage.getItem('token');
        if (!token) {
          message.warning("Vui lòng đăng nhập để truy cập trang này");
          navigate("/auth", { state: { from: location } });
          return false;
        }
        
        // Tải profile trực tiếp từ API để đảm bảo dữ liệu mới nhất
        try {
          const profileData = await getProfile(true);
          
          if (!profileData || !Object.keys(profileData).length) {
            throw new Error("Không tìm thấy thông tin người dùng");
          }
          
          // Chuẩn hóa dữ liệu
          const userData = { ...profileData };
          
          // Đảm bảo có ID
          if (!userData.id) {
            userData.id = userData.userId || userData._id || Date.now().toString();
          }
          
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
          return true;
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          
          // Thử lấy từ getCurrentUser như fallback
          const user = await getCurrentUser({ forceRefresh: true });
          
          if (!user) {
            message.error("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại");
            navigate("/auth", { state: { from: location } });
            return false;
          }
          
          setCurrentUser(user);
          setLoading(false);
          return true;
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        message.error("Lỗi xác thực, vui lòng đăng nhập lại");
        navigate("/auth", { state: { from: location } });
        return false;
      }
    };
    
    checkAuth();
  }, [navigate, location]);
  
  // Khi có sự thay đổi localStorage, cập nhật lại currentUser
  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setCurrentUser(userData);
        } catch (e) {
          console.error("Failed to parse user data from localStorage:", e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Đang tải thông tin..." />
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
        <Title level={3} className="mb-6">Tài khoản của tôi</Title>
        
        <Layout className="bg-transparent">
          <div className="flex flex-col md:flex-row ">
            <ProfileSidebar user={currentUser} location={location} />
            
            <Content className="bg-white shadow-sm rounded-lg p-6 w-full">
              <Routes>
                <Route path="/" element={<AccountInfo user={currentUser} />} />
                <Route path="/password" element={<PasswordChange user={currentUser} />} />
                <Route path="/orders" element={<OrderHistory user={currentUser} />} />
              </Routes>
            </Content>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default ProfilePage;