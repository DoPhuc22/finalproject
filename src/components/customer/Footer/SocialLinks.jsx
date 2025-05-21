import React from 'react';
import { Space, Button } from 'antd';
import { 
  FacebookOutlined, 
  InstagramOutlined, 
  TwitterOutlined, 
  LinkedinOutlined 
} from '@ant-design/icons';

const SocialLinks = () => {
  return (
    <Space size="large">
      <Button 
        type="text" 
        shape="circle" 
        icon={<FacebookOutlined className="text-xl" />} 
        className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
        href="https://facebook.com"
        target="_blank"
      />
      <Button 
        type="text" 
        shape="circle" 
        icon={<InstagramOutlined className="text-xl" />} 
        className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
        href="https://instagram.com"
        target="_blank"
      />
      <Button 
        type="text" 
        shape="circle" 
        icon={<TwitterOutlined className="text-xl" />} 
        className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
        href="https://twitter.com"
        target="_blank"
      />
      <Button 
        type="text" 
        shape="circle" 
        icon={<LinkedinOutlined className="text-xl" />} 
        className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
        href="https://linkedin.com"
        target="_blank"
      />
    </Space>
  );
};

export default SocialLinks;