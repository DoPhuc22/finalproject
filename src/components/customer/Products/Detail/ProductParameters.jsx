// components/customer/Products/Detail/ProductParameters.jsx
import React from 'react';
import { Typography, Table, Card } from 'antd';

const { Title } = Typography;

const ProductParameters = ({ product, attributes = [] }) => {
  const activeAttributes = attributes.filter(attr =>
    attr.status === 'active' || attr.status === undefined || attr.status === null
  );
  // Dữ liệu thuộc tính đã được sắp xếp
  const formattedAttributes = activeAttributes.map(attr => ({
    key: attr.attr_value_id || attr.attrValueId,
    name: attr.attributeType?.name || attr.name || attr.attributeName || 'Không có tên',
    value: attr.value || 'Không có giá trị'
  }));

  // Bổ sung các thuộc tính cơ bản nếu không có trong danh sách thuộc tính
  const basicAttributes = [
    { 
      key: 'brand', 
      name: 'Thương hiệu', 
      value: typeof product.brand === 'object' ? product.brand.name : product.brand || 'Không có'
    },
    { 
      key: 'category', 
      name: 'Danh mục', 
      value: typeof product.category === 'object' ? product.category.name : product.category || 'Không có'
    },
  ];

  // Kết hợp danh sách thuộc tính API và thuộc tính cơ bản
  // Loại bỏ các thuộc tính trùng lặp
  const allAttributes = [
    ...basicAttributes,
    ...formattedAttributes.filter(attr => 
      !basicAttributes.some(basic => basic.name.toLowerCase() === attr.name.toLowerCase())
    )
  ];

  const columns = [
    {
      title: 'Thông số',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    }
  ];

  return (
    <div className="product-parameters py-6">
      <Title level={4} className="mb-4">Thông số kỹ thuật</Title>
      
      <Card bordered={false} className="bg-gray-50">
        <Table 
          dataSource={allAttributes} 
          columns={columns} 
          pagination={false}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default ProductParameters;