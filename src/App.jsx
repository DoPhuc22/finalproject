import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { getCurrentUser } from "./services/auth";

// LAYOUTS
import CustomerLayout from "./layouts/CustomerLayout";

// ADMIN PAGES
import AdminLoginPage from "./pages/admin/LoginPage";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import ProductPage from "./pages/admin/ProductPage";
import CategoryPage from "./pages/admin/CategoryPage";
import BrandPage from "./pages/admin/BrandPage";
import CustomerPage from "./pages/admin/CustomerPage";
import AttributeTypePage from "./pages/admin/AttributeTypePage";
import OrderPage from "./pages/admin/OrderPage";
import AttributeValuePage from "./pages/admin/AttributeValuePage";

// CUSTOMER PAGES
import HomePage from "./pages/customer/HomePage";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutForm from "./components/customer/Cart/CheckoutForm";
import AuthPage from "./pages/customer/AuthPage";
import ContactPage from "./pages/customer/ContactPage";
import ProfilePage from "./pages/customer/ProfilePage";
import VNPayCallback from "./pages/customer/VNPayCallback";
import OrderSuccess from "./pages/customer/OrderSuccess";
import VNPayRedirect from "./pages/customer/VNPayRedirect";



function App() {
  // Customize Ant Design theme
  const theme = {
    token: {
      colorPrimary: "#3AA1A0", // Verdigris brand color
      borderRadius: 8,
      fontFamily: "Roboto, sans-serif",
    },
    components: {
      Button: {
        colorPrimary: "#3AA1A0",
        algorithm: true,
      },
      Card: {
        colorBgContainer: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      },
    },
  };

  useEffect(() => {
    // Check authentication on app load
    getCurrentUser();
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/categories" element={<CategoryPage />} />
          <Route path="/admin/brands" element={<BrandPage />} />
          <Route path="/admin/customers" element={<CustomerPage />} />
          <Route path="/admin/orders" element={<OrderPage />} />
          <Route path="/admin/attribute_types" element={<AttributeTypePage />} />
          <Route path="/admin/attribute_values" element={<AttributeValuePage />} />

          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route path="/vnpay-callback" element={<VNPayCallback />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/vnpay-redirect" element={<VNPayRedirect />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;