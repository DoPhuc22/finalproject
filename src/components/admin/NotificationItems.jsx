import React from 'react';
import { Badge, Typography } from 'antd';

const { Text } = Typography;

const getNotificationItems = () => [
  {
    key: '1',
    label: (
      <div className="flex items-start py-2 px-1">
        <Badge status="processing" className="mt-1 mr-2" />
        <div>
          <Text strong>Đơn hàng mới #WS-3245</Text>
          <div>Khách hàng: Nguyễn Văn A</div>
          <div className="text-xs text-gray-500 mt-1">2 phút trước</div>
        </div>
      </div>
    ),
  },
  {
    key: '2',
    label: (
      <div className="flex items-start py-2 px-1">
        <Badge status="warning" className="mt-1 mr-2" />
        <div>
          <Text strong>Sản phẩm sắp hết hàng</Text>
          <div>Đồng hồ Seiko Presage - Còn 2 sản phẩm</div>
          <div className="text-xs text-gray-500 mt-1">1 giờ trước</div>
        </div>
      </div>
    ),
  },
  {
    key: '3',
    label: (
      <div className="flex items-start py-2 px-1">
        <Badge status="success" className="mt-1 mr-2" />
        <div>
          <Text strong>Đơn hàng đã hoàn thành</Text>
          <div>Đơn hàng #WS-3242 đã giao thành công</div>
          <div className="text-xs text-gray-500 mt-1">3 giờ trước</div>
        </div>
      </div>
    ),
  },
  {
    type: 'divider',
  },
  {
    key: '4',
    label: (
      <div className="text-center">
        <Text className="text-verdigris-500">Xem tất cả thông báo</Text>
      </div>
    ),
  },
];

export default getNotificationItems;