import React from 'react';
import { Typography } from 'antd';
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const ContactInfo = () => {
  return (
    <>
      <Title level={4} className="text-white">Liên hệ</Title>
      <ul className="list-none p-0">
        <li className="mb-3 flex items-start">
          <EnvironmentOutlined className="mt-1 mr-2 text-white/80" />
          <span className="text-white/80">123 Đường Sigma, Thanh Xuân, TP. Hà Nội</span>
        </li>
        <li className="mb-3 flex items-center">
          <PhoneOutlined className="mr-2 text-white/80" />
          <a href="tel:+84123456789" className="text-white/80 hover:text-white hover:no-underline">+84 123 456 789</a>
        </li>
        <li className="mb-3 flex items-center">
          <MailOutlined className="mr-2 text-white/80" />
          <a href="mailto:info@watchstore.com" className="text-white/80 hover:text-white hover:no-underline">WatchSigma@watchstore.com</a>
        </li>
        <li className="mb-3 flex items-start">
          <ClockCircleOutlined className="mt-1 mr-2 text-white/80" />
          <div>
            <p className="text-white/80 m-0">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
            <p className="text-white/80 m-0">Thứ 7 & CN: 9:00 - 18:00</p>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ContactInfo;