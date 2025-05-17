import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/slices/authSlice';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await dispatch(login(values)).unwrap();
      message.success('Đăng nhập thành công!');
      // Redirect will be handled by the auth slice
    } catch (error) {
      message.error(error || 'Đăng nhập thất bại, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="login-form"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input 
          prefix={<UserOutlined className="site-form-item-icon" />} 
          placeholder="Email" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Mật khẩu"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between items-center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link to="/forgot-password" className="text-verdigris-500 hover:text-verdigris-600 hover:no-underline">
            Quên mật khẩu?
          </Link>
        </div>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          size="large" 
          block 
          loading={loading}
          className="bg-verdigris-500 hover:bg-verdigris-600"
        >
          Đăng Nhập
        </Button>
      </Form.Item>

      <Divider plain>Hoặc đăng nhập với</Divider>
      
      <div className="flex justify-center space-x-4 mb-4">
        <Button 
          shape="circle" 
          icon={<GoogleOutlined />} 
          size="large"
          className="flex items-center justify-center border-gray-300"
        />
        <Button 
          shape="circle" 
          icon={<FacebookOutlined />} 
          size="large"
          className="flex items-center justify-center border-gray-300"
        />
      </div>
    </Form>
  );
};

export default LoginForm;