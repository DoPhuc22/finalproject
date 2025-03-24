import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h1>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button
        onClick={toggleForm}
        className="mt-4 text-verdigris-500 hover:text-verdigris-600 hover:no-underline"
      >
        {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
      </button>
    </div>
  );
};

export default AuthPage;