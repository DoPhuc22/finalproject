import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Space, Divider } from 'antd';
import { UserOutlined, KeyOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '../../components/customer/Auth/LoginForm';
import RegisterForm from '../../components/customer/Auth/RegisterForm';

const { Title, Text } = Typography;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('login');
  
  useEffect(() => {
    // Check URL query params to see if we should show login or register tab
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  const handleTabChange = (key) => {
    setActiveTab(key);
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