import React from 'react';
import { Table, Typography } from 'antd';

const { Title } = Typography;

const ProductParameters = ({ product }) => {
  // Tạo dữ liệu thông số kỹ thuật dựa trên loại đồng hồ
  const getSpecificationsForProduct = () => {
    const baseSpecifications = [
      { parameter: 'Thương hiệu', value: product.brand },
      { parameter: 'Model', value: `${product.brand}-${product.id}` },
      { parameter: 'Xuất xứ', value: product.origin || 'Thụy Sĩ' },
      { parameter: 'Mặt kính', value: 'Sapphire (Kính chống trầy)' },
      { parameter: 'Chất liệu vỏ', value: 'Thép không gỉ 316L' },
      { parameter: 'Chất liệu dây', value: 'Dây da cao cấp' },
      { parameter: 'Đường kính mặt', value: '40mm' },
      { parameter: 'Độ dày', value: '12mm' },
      { parameter: 'Chống nước', value: '3 ATM' },
      { parameter: 'Bảo hành', value: '12 tháng' },
    ];
    
    // Thêm thông số kỹ thuật theo từng loại đồng hồ
    switch (product.category) {
      case 'mechanical':
        return [
          ...baseSpecifications,
          { parameter: 'Loại máy', value: 'Cơ (Automatic)' },
          { parameter: 'Năng lượng dự trữ', value: '40 giờ' },
          { parameter: 'Số chân kính', value: '21 chân kính' },
          { parameter: 'Chức năng', value: 'Hiển thị giờ, phút, giây, ngày' },
          { parameter: 'Độ chính xác', value: '+/- 5 giây/ngày' },
        ];
      case 'smart':
        return [
          ...baseSpecifications,
          { parameter: 'Hệ điều hành', value: 'watchOS / Wear OS' },
          { parameter: 'Thời lượng pin', value: 'Lên đến 18 giờ' },
          { parameter: 'Kết nối', value: 'Bluetooth 5.0, WiFi, GPS' },
          { parameter: 'Bộ nhớ', value: '32GB' },
          { parameter: 'Cảm biến', value: 'Nhịp tim, SpO2, Gia tốc kế, Con quay hồi chuyển' },
          { parameter: 'Chức năng', value: 'Theo dõi sức khỏe, Thông báo, GPS, Thanh toán không tiếp xúc' },
        ];
      case 'sport':
        return [
          ...baseSpecifications,
          { parameter: 'Loại máy', value: 'Quartz (Pin)' },
          { parameter: 'Chất liệu dây', value: 'Cao su / Silicone' },
          { parameter: 'Chống nước', value: '10 ATM (100m)' },
          { parameter: 'Chức năng', value: 'Bấm giờ, Đồng hồ bấm giờ, Đèn nền' },
          { parameter: 'Độ bền', value: 'Chống va đập, chống từ tính' },
        ];
      case 'classic':
      default:
        return [
          ...baseSpecifications,
          { parameter: 'Loại máy', value: 'Quartz (Pin)' },
          { parameter: 'Thời lượng pin', value: '3 năm' },
          { parameter: 'Chức năng', value: 'Hiển thị giờ, phút, giây, lịch ngày' },
          { parameter: 'Phong cách', value: 'Cổ điển, thanh lịch' },
        ];
    }
  };

  const specifications = getSpecificationsForProduct();
  
  const columns = [
    {
      title: 'Thông số',
      dataIndex: 'parameter',
      key: 'parameter',
      width: '40%',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Chi tiết',
      dataIndex: 'value',
      key: 'value',
    }
  ];

  return (
    <div className="product-parameters py-8">
      <Title level={4} className="mb-6">Thông số kỹ thuật của {product.name}</Title>
      <Table
        dataSource={specifications}
        columns={columns}
        pagination={false}
        rowKey="parameter"
        bordered
        size="middle"
        className="specifications-table"
      />
    </div>
  );
};

export default ProductParameters;