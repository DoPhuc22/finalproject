import React from 'react';
import { Card, Typography, Progress, Empty } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const CategoryPercentages = ({ categories }) => {
  console.log('CategoryPercentages received categories:', categories);

  // Kiểm tra nếu không có danh mục
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <Card 
        title="Thống kê theo danh mục" 
        bordered={false} 
        className="shadow-sm"
        extra={<Link to="/admin/products" className="text-verdigris-500">Chi tiết</Link>}
      >
        <Empty description="Không có dữ liệu danh mục" />
      </Card>
    );
  }

  return (
    <Card 
      title="Thống kê theo danh mục" 
      bordered={false} 
      className="shadow-sm"
      extra={<Link to="/admin/products" className="text-verdigris-500">Chi tiết</Link>}
    >
      {categories.map((item, index) => (
        <div className="mb-4" key={index}>
          <div className="flex justify-between mb-2">
            <Text>{item.category}</Text>
            <Text type="secondary">{item.percentage}%</Text>
          </div>
          <Progress 
            percent={item.percentage} 
            strokeColor="#3AA1A0" 
            showInfo={false}
          />
        </div>
      ))}
    </Card>
  );
};

export default CategoryPercentages;