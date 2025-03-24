import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Image, Space, Typography, Empty, Divider } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { removeFromWishlist, selectWishlistItems } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

const { Title, Text } = Typography;

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (product) => {
    // Add to cart
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      quantity: 1
    }));
    
    // Remove from wishlist
    dispatch(removeFromWishlist(product.id));
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Image 
            width={80} 
            src={record.image} 
            alt={text} 
            fallback="/assets/images/products/watch.jpg" 
            className="mr-4 rounded"
          />
          <div>
            <Link to={`/products/${record.id}`} className="text-lg font-medium hover:text-verdigris-500">
              {text}
            </Link>
            <Text type="secondary" className="block">{record.brand}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text className="text-lg font-medium text-verdigris-600">
          {price?.toLocaleString() || 0} VNĐ
        </Text>
      ),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock) => (
        <Text className={inStock ? "text-green-600" : "text-red-600"}>
          {inStock ? "Còn hàng" : "Hết hàng"}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => handleMoveToCart(record)}
            disabled={!record.inStock}
          >
            Thêm vào giỏ
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveFromWishlist(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="mb-0">Danh Sách Yêu Thích</Title>
        <Link to="/products" className="text-verdigris-500 hover:text-verdigris-600">
          <Space>
            <ArrowLeftOutlined />
            <span>Tiếp tục mua sắm</span>
          </Space>
        </Link>
      </div>

      <Divider />
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-10">
          <Empty
            description={
              <span className="text-lg">Danh sách yêu thích của bạn đang trống</span>
            }
          >
            <Link to="/products">
              <Button type="primary" className="mt-4">
                Khám phá sản phẩm
              </Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={wishlistItems.map(item => ({ ...item, key: item.id }))}
          pagination={false}
          rowClassName="hover:bg-gray-50"
        />
      )}
    </div>
  );
};

export default WishlistPage;