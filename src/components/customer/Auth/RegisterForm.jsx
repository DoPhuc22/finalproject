import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../../services/auth';
import { loginSuccess } from '../../../store/slices/authSlice';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Remove confirm password from values sent to API
      const { confirmPassword, agreement, ...userData } = values;
      const response = await register(userData);
      dispatch(loginSuccess(response));
      message.success('Đăng ký thành công!');
      // Redirect will be handled by the auth slice
    } catch (error) {
      message.error(error?.message || 'Đăng ký thất bại, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      initialValues={{ agreement: true }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="register-form"
    >
      <Form.Item
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên của bạn!' }
        ]}
      >
        <Input 
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Họ và tên"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input 
          prefix={<MailOutlined className="site-form-item-icon" />}
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

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Xác nhận mật khẩu"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản sử dụng')),
          },
        ]}
      >
        <Checkbox>
          Tôi đã đọc và đồng ý với <Link to="/terms" className="text-verdigris-500 hover:text-verdigris-600 hover:no-underline">điều khoản sử dụng</Link>
        </Checkbox>
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
          Đăng Ký
        </Button>
      </Form.Item>

      <Divider plain>Hoặc đăng ký với</Divider>
      
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

export default RegisterForm;