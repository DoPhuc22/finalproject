import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Space, Divider, Spin } from 'antd';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/customer/Auth/LoginForm';
import RegisterForm from '../../components/customer/Auth/RegisterForm';
import { getCurrentUser, isAuthenticated } from '../../services/auth';

const { Title, Text } = Typography;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setLoading(true);
        
        // Kiểm tra từ localStorage trước
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user && user.id) {
              console.log('User already logged in from localStorage:', user);
              
              // Redirect based on user role
              if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
              } else {
                navigate('/profile', { replace: true });
              }
              return;
            }
          } catch (e) {
            console.error('Error parsing user from localStorage:', e);
            // Continue to API check if localStorage parsing fails
          }
        }
        
        // Double check with API
        const authStatus = await isAuthenticated();
        if (authStatus) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            console.log('User already logged in from API:', currentUser);
            
            // Redirect based on user role
            if (currentUser.role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            } else {
              navigate('/profile', { replace: true });
            }
            return;
          }
        }
        
        // User is not authenticated, continue to show auth page
        console.log('User not authenticated, showing auth page');
        
      } catch (error) {
        console.error('Error checking authentication:', error);
        // If there's an error, assume user is not authenticated and show auth page
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  // Set active tab based on URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Update URL without adding to history
    const newSearchParams = new URLSearchParams();
    if (key === 'register') {
      newSearchParams.set('tab', 'register');
    }
    const newUrl = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  const items = [
    {
      key: 'login',
      label: (
        <span className="flex items-center">
          <LoginOutlined className="mr-2" />
          Đăng Nhập
        </span>
      ),
      children: <LoginForm />,
    },
    {
      key: 'register',
      label: (
        <span className="flex items-center">
          <UserAddOutlined className="mr-2" />
          Đăng Ký
        </span>
      ),
      children: <RegisterForm />,
    },
  ];

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[80vh]" style={{ backgroundColor: '#E6F2F1' }}>
        <Card 
          bordered={false}
          className="w-full max-w-md shadow-lg rounded-lg"
          bodyStyle={{ padding: '48px 32px' }}
        >
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4">
              <Text type="secondary">Đang kiểm tra trạng thái đăng nhập...</Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[80vh]" style={{ backgroundColor: '#E6F2F1' }}>
      <Card 
        bordered={false}
        className="w-full max-w-md shadow-lg rounded-lg"
        bodyStyle={{ padding: '24px 32px' }}
      >
        <div className="text-center mb-6">
          <Space direction="vertical" size={1}>
            <div className="flex justify-center mb-3">
              <div className="bg-verdigris-500 text-white p-3 rounded-full">
                {activeTab === 'login' ? <LoginOutlined style={{ fontSize: '24px' }} /> : <UserAddOutlined style={{ fontSize: '24px' }} />}
              </div>
            </div>
            <Title level={3} className="m-0">
              {activeTab === 'login' ? 'Chào Mừng Trở Lại' : 'Tạo Tài Khoản Mới'}
            </Title>
            <Text type="secondary">
              {activeTab === 'login' 
                ? 'Đăng nhập để tiếp tục mua sắm' 
                : 'Đăng ký để theo dõi đơn hàng và nhiều hơn nữa'}
            </Text>
          </Space>
        </div>

        <Divider />

        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          centered
          items={items}
          className="auth-tabs"
        />
      </Card>
    </div>
  );
};

export default AuthPage;