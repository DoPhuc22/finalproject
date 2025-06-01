import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import CustomerLayout from "./layouts/CustomerLayout";
import HomePage from "./pages/customer/HomePage";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import AuthPage from "./pages/customer/AuthPage";
import ContactPage from "./pages/customer/ContactPage";
import CheckoutForm from "./components/customer/Cart/CheckoutForm";
import AdminLoginPage from "./pages/admin/LoginPage";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { restoreAuthState } from "./store/slices/authSlice";

function App() {
  // Customize Ant Design theme to match your brand colors
  const theme = {
    token: {
      colorPrimary: "#3AA1A0", // Verdigris brand color
      borderRadius: 8,
      fontFamily: "Roboto, sans-serif",
    },
    components: {
      Button: {
        colorPrimary: "#3AA1A0",
        algorithm: true, // Enable algorithm
      },
      Card: {
        colorBgContainer: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      },
    },
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(restoreAuthState()); 
  }, [dispatch]);
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
