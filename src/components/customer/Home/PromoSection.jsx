import React from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const PromoSection = () => {
  return (
    <div className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <Title level={2} className="text-white mb-4">Ưu Đãi Đặc Biệt</Title>
        <Paragraph className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Đăng ký nhận thông tin để không bỏ lỡ những ưu đãi độc quyền và bộ sưu tập mới nhất từ Watch Store
        </Paragraph>
        <Space direction="horizontal" size="large">
          <Button size="large" type="primary" className="bg-white text-blue-600 border-white hover:bg-gray-100">
            <Link to="/auth" className='hover:no-underline'>Đăng ký ngay</Link>
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default PromoSection;