import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Layout, 
  Menu, 
  Input, 
  Button, 
  Badge, 
  Dropdown, 
  Space, 
  Drawer, 
  Divider,
  Avatar,
  Typography
} from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  HeartOutlined, 
  SearchOutlined,
  MenuOutlined,
  DownOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Text } = Typography;

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    {
      key: '/',
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: 'watches',
      label: (
        <Dropdown
          menu={{
            items: [
              { key: 'mechanical', label: <Link to="/products?category=mechanical">Đồng hồ cơ</Link> },
              { key: 'sport', label: <Link to="/products?category=sport">Đồng hồ thể thao</Link> },
              { key: 'smart', label: <Link to="/products?category=smart">Đồng hồ thông minh</Link> },
              { key: 'classic', label: <Link to="/products?category=classic">Đồng hồ cổ điển</Link> },
              { type: 'divider' },
              { key: 'all', label: <Link to="/products">Tất cả sản phẩm</Link> },
            ]
          }}
        >
          <Space>
            Đồng hồ
            <DownOutlined />
          </Space>
        </Dropdown>
      )
    },
    {
      key: '/brands',
      label: <Link to="/products?filter=brands">Thương hiệu</Link>,
    },
    {
      key: '/sale',
      label: <Link to="/products?sale=true" className="text-red-500 font-semibold">SALE</Link>,
    },
    {
      key: '/about',
      label: <Link to="/about">Giới thiệu</Link>,
    },
    {
      key: '/contact',
      label: <Link to="/contact">Liên hệ</Link>,
    },
  ];

  // User dropdown items
  const userMenuItems = isAuthenticated
    ? [
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/profile">Tài khoản</Link>,
        },
        {
          key: 'orders',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/orders">Đơn hàng</Link>,
        },
        {
          key: 'wishlist',
          icon: <HeartOutlined />,
          label: <Link to="/wishlist">Danh sách yêu thích</Link>,
        },
        { type: 'divider' },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
        },
      ]
    : [
        {
          key: 'login',
          icon: <LoginOutlined />,
          label: <Link to="/auth">Đăng nhập</Link>,
        },
        {
          key: 'register',
          icon: <UserAddOutlined />,
          label: <Link to="/auth?tab=register">Đăng ký</Link>,
        },
      ];

  return (
    <>
      <AntHeader 
        className={`fixed w-full z-10 px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md text-gray-800' : 'bg-verdigris-500 text-white'
        }`}
        style={{ height: 'auto', lineHeight: '1.5', padding: '10px 20px' }}
      >
        {/* Mobile menu button */}
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={() => setVisible(true)} 
          className={`lg:hidden ${scrolled ? 'text-gray-800' : 'text-white'}`}
        />
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/images/logo.svg" 
              alt="Watch Store Logo" 
              className="h-10 mr-2" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40x40/3AA1A0/FFFFFF?text=WS";
              }}
            />
            <span className={`text-xl font-bold hidden md:block ${scrolled ? 'text-verdigris-500' : 'text-white'}`}>
              Watch Store
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:block flex-grow px-4">
          <Menu 
            mode="horizontal" 
            selectedKeys={[location.pathname]} 
            items={navItems}
            className={`border-0 ${scrolled ? 'bg-white text-gray-800' : 'bg-verdigris-500 text-white'}`}
            style={{ background: 'transparent' }}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Search button - visible on all screens */}
          <Button 
            type="text" 
            icon={<SearchOutlined />} 
            onClick={() => setSearchVisible(!searchVisible)} 
            className={`flex items-center justify-center ${scrolled ? 'text-gray-800' : 'text-white'}`}
          />
          
          {/* Wishlist - with counter */}
          <Link to="/wishlist" className="hidden sm:block">
            <Badge count={wishlistItems.length} size="small">
              <Button 
                type="text" 
                icon={<HeartOutlined />} 
                className={`flex items-center justify-center ${scrolled ? 'text-gray-800' : 'text-white'}`}
              />
            </Badge>
          </Link>
          
          {/* User dropdown or auth links */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button
              type="text"
              icon={isAuthenticated ? <Avatar size="small" src={user?.avatar}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar> : <UserOutlined />}
              className={`flex items-center justify-center ${scrolled ? 'text-gray-800' : 'text-white'}`}
            />
          </Dropdown>
          
          {/* Cart */}
          <Link to="/cart">
            <Badge count={cartItems.length} size="small">
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined />} 
                className={`flex items-center justify-center ${scrolled ? 'text-gray-800' : 'text-white'}`}
              />
            </Badge>
          </Link>
        </div>
      </AntHeader>
      
      {/* Search input that appears when the search icon is clicked */}
      {searchVisible && (
        <div className={`fixed top-[64px] left-0 w-full z-10 px-4 py-3 shadow-md transition-all duration-300 ${
          scrolled ? 'bg-white' : 'bg-verdigris-400'
        }`}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            enterButton
            size="large"
            className="max-w-3xl mx-auto"
            onSearch={(value) => console.log('Searching for:', value)}
          />
        </div>
      )}
      
      {/* Mobile side drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <img 
              src="/assets/images/logo.svg" 
              alt="Watch Store Logo" 
              className="h-8 mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32x32/3AA1A0/FFFFFF?text=WS";
              }}
            />
            <span className="text-lg font-bold">Watch Store</span>
          </div>
        }
        placement="left"
        onClose={() => setVisible(false)}
        open={visible}
        width={280}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ border: 'none' }}
        >
          {navItems.map(item => (
            <Menu.Item key={item.key} onClick={() => setVisible(false)}>
              {item.label}
            </Menu.Item>
          ))}
          
          <Divider />
          
          {!isAuthenticated ? (
            <>
              <Menu.Item key="login" icon={<LoginOutlined />} onClick={() => setVisible(false)}>
                <Link to="/auth">Đăng nhập</Link>
              </Menu.Item>
              <Menu.Item key="register" icon={<UserAddOutlined />} onClick={() => setVisible(false)}>
                <Link to="/auth?tab=register">Đăng ký</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <div className="p-4 mb-2 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Avatar size="large" src={user?.avatar}>
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <div className="ml-3">
                    <Text strong>{user?.name || 'Người dùng'}</Text>
                    <Text type="secondary" className="block">{user?.email}</Text>
                  </div>
                </div>
              </div>
              <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => setVisible(false)}>
                <Link to="/profile">Tài khoản</Link>
              </Menu.Item>
              <Menu.Item key="orders" icon={<ShoppingCartOutlined />} onClick={() => setVisible(false)}>
                <Link to="/orders">Đơn hàng</Link>
              </Menu.Item>
              <Menu.Item key="mobile-wishlist" icon={<HeartOutlined />} onClick={() => setVisible(false)}>
                <Link to="/wishlist">
                  Danh sách yêu thích
                  {wishlistItems.length > 0 && (
                    <Badge count={wishlistItems.length} size="small" className="ml-2" />
                  )}
                </Link>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
                Đăng xuất
              </Menu.Item>
            </>
          )}
        </Menu>
      </Drawer>
      
      {/* Spacer to prevent content from hiding under the fixed header */}
      <div style={{ height: searchVisible ? '120px' : '64px' }}></div>
    </>
  );
};

export default Header;