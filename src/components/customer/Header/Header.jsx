import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
  Typography,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  DownOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { logout as logoutAPI, getCurrentUser, isAuthenticated } from "../../../services/auth";

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Text } = Typography;

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const searchInputRef = useRef(null);

  // Kiểm tra trạng thái đăng nhập khi component mount và khi location thay đổi
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        const user = getCurrentUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    };
    
    checkAuthStatus();
  }, [location]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      // Gọi API logout
      await logoutAPI();
      // Xóa thông tin user từ state
      setCurrentUser(null);
      setAuthenticated(false);
      // Hiển thị thông báo thành công
      message.success("Đăng xuất thành công!");
      // Đóng mobile drawer nếu đang mở
      setVisible(false);
      // Chuyển hướng về trang chủ
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Dù có lỗi API vẫn logout local state
      setCurrentUser(null);
      setAuthenticated(false);
      message.info("Đã đăng xuất");
      setVisible(false);
      navigate("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  // Handle menu item click
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input when search becomes visible
  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [searchVisible]);

  // Navigation items - Sử dụng location để xác định trang hiện tại
  const getNavItems = () => [
    {
      key: "/",
      label: (
        <Link
          to="/"
          className={`hover:no-underline ${scrolled ? "text-gray-800" : "text-white"}`}
        >
          Trang chủ
        </Link>
      ),
    },
    {
      key: "watches",
      label: (
        <Dropdown
          menu={{
            items: [
              {
                key: "mechanical",
                label: (
                  <Link
                    to="/products?category=mechanical"
                    className="hover:no-underline"
                  >
                    Đồng hồ cơ
                  </Link>
                ),
              },
              {
                key: "sport",
                label: (
                  <Link
                    to="/products?category=sport"
                    className="hover:no-underline"
                  >
                    Đồng hồ thể thao
                  </Link>
                ),
              },
              {
                key: "smart",
                label: (
                  <Link
                    to="/products?category=smart"
                    className="hover:no-underline"
                  >
                    Đồng hồ thông minh
                  </Link>
                ),
              },
              {
                key: "classic",
                label: (
                  <Link
                    to="/products?category=classic"
                    className="hover:no-underline"
                  >
                    Đồng hồ cổ điển
                  </Link>
                ),
              },
              { type: "divider" },
              {
                key: "all",
                label: (
                  <Link to="/products" className="hover:no-underline">
                    Tất cả sản phẩm
                  </Link>
                ),
              },
            ],
          }}
        >
          <Space
            className={`hover:no-underline ${scrolled ? "text-gray-800" : "text-white"}`}
          >
            Đồng hồ
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
    {
      key: "/sale",
      label: (
        <Link
          to="/products?sale=true"
          className={`text-red-500 font-semibold hover:no-underline ${scrolled ? "" : "text-white"}`}
        >
          SALE
        </Link>
      ),
    },
    {
      key: "/contact",
      label: (
        <Link
          to="/contact"
          className={`hover:no-underline ${scrolled ? "text-gray-800" : "text-white"}`}
        >
          Liên hệ
        </Link>
      ),
    },
    {
      key: "/admin/dashboard",
      label: (
        <Link
          to="/admin/dashboard"
          className={`hover:no-underline ${scrolled ? "text-gray-800" : "text-white"}`}
        >
          Link sang trang quản trị (để tạm)
        </Link>
      ),
    },
  ];

  const navItems = getNavItems();

  // Xác định trang hiện tại để đánh dấu menu item đang active
  const getCurrentMenuKey = () => {
    const pathname = location.pathname;
    if (pathname === "/") return "/";

    // Kiểm tra xem pathname có chứa '/products' không
    if (pathname.includes("/products")) {
      // Nếu URL có chứa 'sale=true' thì đánh dấu menu SALE
      if (location.search.includes("sale=true")) return "/sale";
      // Nếu URL có chứa 'filter=brands' thì đánh dấu menu Thương hiệu
      if (location.search.includes("filter=brands")) return "/products";
      // Nếu là trang products khác thì đánh dấu menu Đồng hồ
      return "watches";
    }

    return pathname;
  };

  // User dropdown items
  const userMenuItems = authenticated
    ? [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: (
            <Link to="/profile" className="hover:no-underline">
              Quản lý tài khoản
            </Link>
          ),
        },
        {
          key: "orders",
          icon: <ShoppingCartOutlined />,
          label: (
            <Link to="/profile/orders" className="hover:no-underline">
              Đơn hàng
            </Link>
          ),
        },
        { type: "divider" },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: logoutLoading ? "Đang đăng xuất..." : "Đăng xuất",
          disabled: logoutLoading,
        },
      ]
    : [
        {
          key: "login",
          icon: <LoginOutlined />,
          label: (
            <Link to="/auth" className="hover:no-underline">
              Đăng nhập
            </Link>
          ),
        },
        {
          key: "register",
          icon: <UserAddOutlined />,
          label: (
            <Link to="/auth?tab=register" className="hover:no-underline">
              Đăng ký
            </Link>
          ),
        },
      ];

  // Handle search
  const handleSearch = (value) => {
    if (value.trim()) {
      // Redirect to search results page
      window.location.href = `/products?search=${encodeURIComponent(value.trim())}`;
      setSearchVisible(false);
    }
  };

  // Lắng nghe sự kiện localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        const user = getCurrentUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <AntHeader
        className={`fixed w-full z-10 px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-verdigris-500"
        }`}
        style={{ height: "auto", lineHeight: "1.5", padding: "10px 20px" }}
      >
        {/* Mobile menu button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setVisible(true)}
          className={`lg:hidden ${scrolled ? "text-gray-800" : "text-white"}`}
          style={{ color: scrolled ? "#1f2937" : "#ffffff" }}
        />

        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center hover:no-underline">
            <img
              src="/assets/images/logo.png"
              alt="Watch Store Logo"
              className="h-10 mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/40x40/3AA1A0/FFFFFF?text=WS";
              }}
            />
            <span
              className={`text-xl font-bold hidden md:block ${scrolled ? "text-verdigris-500" : "text-white"}`}
            >
              Watch Store
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block flex-grow px-4">
          <Menu
            mode="horizontal"
            selectedKeys={[getCurrentMenuKey()]}
            items={navItems}
            className={`border-0 custom-menu ${scrolled ? "bg-white" : "bg-verdigris-500"}`}
            style={{
              background: "transparent",
              color: scrolled ? "#1f2937" : "#ffffff",
              borderBottom: "none",
            }}
            theme={scrolled ? "light" : "dark"}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Animated Search Bar */}
          <div className="relative flex items-center">
            <div
              className={`search-animation overflow-hidden transition-all duration-300 ease-in-out mr-2 ${
                searchVisible ? "w-48 md:w-64 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <Input
                ref={searchInputRef}
                placeholder="Tìm kiếm..."
                className="rounded-full"
                onPressEnter={(e) => handleSearch(e.target.value)}
                suffix={
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => setSearchVisible(false)}
                    className="text-gray-400 hover:text-gray-600"
                  />
                }
              />
            </div>
            <Button
              type="text"
              icon={searchVisible ? <SearchOutlined /> : <SearchOutlined />}
              onClick={() => setSearchVisible(!searchVisible)}
              className={`flex items-center justify-center ${scrolled ? "text-gray-800" : "text-white"}`}
              style={{ color: scrolled ? "#1f2937" : "#ffffff" }}
            />
          </div>

          {/* User dropdown or auth links */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
          >
            {authenticated ? (
              <div className="flex items-center cursor-pointer">
                <Avatar 
                  size="small" 
                  className="bg-verdigris-500 flex items-center justify-center"
                >
                  {currentUser?.name?.charAt(0)?.toUpperCase() || <UserOutlined />}
                </Avatar>
                <span className="ml-2 hidden md:inline text-sm text-white">
                  {currentUser?.name?.split(' ').pop() || 'Người dùng'}
                </span>
              </div>
            ) : (
              <Button
                type="text"
                icon={<UserOutlined />}
                className={`flex items-center justify-center ${scrolled ? "text-gray-800" : "text-white"}`}
                style={{ color: scrolled ? "#1f2937" : "#ffffff" }}
              />
            )}
          </Dropdown>

          {/* Cart */}
          <Link to="/cart" className="hover:no-underline">
            <Badge count={cartItems.length} size="small">
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                className={`flex items-center justify-center ${scrolled ? "text-gray-800" : "text-white"}`}
                style={{ color: scrolled ? "#1f2937" : "#ffffff" }}
              />
            </Badge>
          </Link>
        </div>
      </AntHeader>

      {/* Mobile side drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <img
              src="/assets/images/logo.png"
              alt="Watch Store Logo"
              className="h-8 mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/32x32/3AA1A0/FFFFFF?text=WS";
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
        {/* Mobile Search */}
        <div className="px-4 pb-4">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            enterButton
            onSearch={handleSearch}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getCurrentMenuKey()]}
          style={{ border: "none" }}
          className="custom-mobile-menu"
          onClick={handleMenuClick}
        >
          {navItems.map((item) => {
            // Clone item và điều chỉnh label để không áp dụng màu sắc trong mobile drawer
            const itemForMobile = { ...item };
            if (item.key === "watches") {
              // Xử lý đặc biệt cho dropdown
              itemForMobile.label = (
                <span className="hover:no-underline">Đồng hồ</span>
              );
            } else if (item.key === "/sale") {
              itemForMobile.label = (
                <Link
                  to="/products?sale=true"
                  className="text-red-500 font-semibold hover:no-underline"
                >
                  SALE
                </Link>
              );
            } else {
              // Lấy URL từ item gốc
              const linkTo = item.key === "/" ? "/" : item.key;
              itemForMobile.label = (
                <Link to={linkTo} className="hover:no-underline">
                  {item.key === "/"
                    ? "Trang chủ"
                    : item.key === "/products"
                      ? "Thương hiệu"
                      : item.key === "/about"
                        ? "Giới thiệu"
                        : item.key === "/contact"
                          ? "Liên hệ"
                          : item.key === "/admin/dashboard"
                            ? "trang quản trị (để tạm)"
                            : item.key}
                </Link>
              );
            }
            return (
              <Menu.Item
                key={item.key}
                onClick={() => setVisible(false)}
                className={location.pathname === item.key ? "font-bold" : ""}
              >
                {itemForMobile.label}
              </Menu.Item>
            );
          })}

          <Divider />

          {!authenticated ? (
            <>
              <Menu.Item
                key="login"
                icon={<LoginOutlined />}
                onClick={() => setVisible(false)}
              >
                <Link to="/auth" className="hover:no-underline">
                  Đăng nhập
                </Link>
              </Menu.Item>
              <Menu.Item
                key="register"
                icon={<UserAddOutlined />}
                onClick={() => setVisible(false)}
              >
                <Link to="/auth?tab=register" className="hover:no-underline">
                  Đăng ký
                </Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <div className="p-4 mb-2 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Avatar size="large" className="bg-verdigris-500">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || <UserOutlined />}
                  </Avatar>
                  <div className="ml-3">
                    <Text strong>{currentUser?.name || "Người dùng"}</Text>
                    <Text type="secondary" className="block">
                      {currentUser?.email}
                    </Text>
                  </div>
                </div>
              </div>
              <Menu.Item
                key="profile"
                icon={<UserOutlined />}
                onClick={() => setVisible(false)}
              >
                <Link to="/profile" className="hover:no-underline">
                  Quản lý tài khoản
                </Link>
              </Menu.Item>
              <Menu.Item
                key="orders"
                icon={<ShoppingCartOutlined />}
                onClick={() => setVisible(false)}
              >
                <Link to="/profile/orders" className="hover:no-underline">
                  Đơn hàng
                </Link>
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                danger
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </Menu.Item>
            </>
          )}
        </Menu>
      </Drawer>

      {/* Spacer to prevent content from hiding under the fixed header */}
      <div style={{ height: "60px" }}></div>
    </>
  );
};

export default Header;
