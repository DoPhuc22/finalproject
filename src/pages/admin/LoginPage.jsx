import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Divider, 
  Checkbox,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // This would typically connect to your authentication logic
    console.log('Login attempt with:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Đăng nhập thành công!');
      // In a real app, you would redirect to the dashboard here
      window.location.href = '/admin/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-verdigris-600 to-verdigris-400 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl overflow-hidden"
        bordered={false}
        style={{ borderRadius: '12px' }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-verdigris-500 text-white mb-4">
              <LoginOutlined style={{ fontSize: '24px' }} />
            </div>
            <Title level={2} className="m-0 text-gray-800">Admin Portal</Title>
            <Text type="secondary">Đăng nhập để quản lý hệ thống</Text>
          </div>

          <Form
            name="admin_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Tên đăng nhập"
                className="rounded-lg py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Mật khẩu"
                className="rounded-lg py-2"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link to="/admin/reset-password" className="text-verdigris-500 hover:text-verdigris-600 text-sm">
                  Quên mật khẩu?
                </Link>
              </div>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                className="h-12 rounded-lg bg-verdigris-500 hover:bg-verdigris-600 border-0"
                loading={loading}
                icon={<LoginOutlined />}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider className="my-6">
            <Text type="secondary" className="text-xs">Admin Watch Store System</Text>
          </Divider>

          <div className="text-center">
            <Text type="secondary" className="text-xs">
              © {new Date().getFullYear()} Watch Store. Tất cả quyền được bảo lưu.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage;