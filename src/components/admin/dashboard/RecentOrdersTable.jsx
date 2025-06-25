import React from 'react';
import { Card, Table, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';

const RecentOrdersTable = ({ orders }) => {
  console.log('RecentOrdersTable received orders:', orders);

  // Table columns
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Link to={`/admin/orders/${text}`} className="text-verdigris-500">#{text}</Link>,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'name'],
      key: 'customerName',
      render: (_, record) => record.user?.name || 'Không rõ',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN', {  
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${Number(total).toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color;
        let text;
        
        switch(status) {
          case 'delivered':
            color = 'success';
            text = 'Đã giao';
            break;
          case 'pending':
            color = 'warning';
            text = 'Chờ xác nhận';
            break;
          case 'confirmed':
            color = 'processing';
            text = 'Đã xác nhận';
            break;
          case 'shipping':
            color = 'blue';
            text = 'Đang giao';
            break;
          case 'cancelled':
            color = 'error';
            text = 'Đã hủy';
            break;
          default:
            color = 'default';
            text = status;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // Kiểm tra nếu không có đơn hàng
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return (
      <Card 
        title="Đơn hàng gần đây" 
        bordered={false} 
        className="shadow-sm"
        extra={<Link to="/admin/orders" className="text-verdigris-500">Xem tất cả</Link>}
      >
        <Empty description="Không có đơn hàng nào" />
      </Card>
    );
  }

  return (
    <Card 
      title="Đơn hàng gần đây" 
      bordered={false} 
      className="shadow-sm"
      extra={<Link to="/admin/orders" className="text-verdigris-500">Xem tất cả</Link>}
    >
      <Table 
        columns={columns} 
        dataSource={orders.map(order => ({ ...order, key: order.orderId }))} 
        pagination={false}
        size="small"
        locale={{ emptyText: 'Không có đơn hàng nào' }}
      />
    </Card>
  );
};

export default RecentOrdersTable;