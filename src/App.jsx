import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage'; // Thêm import WishlistPage
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';

function App() {
  // Customize Ant Design theme to match your brand colors
  const theme = {
    token: {
      colorPrimary: '#3AA1A0', // Verdigris brand color
      borderRadius: 8,
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      Button: {
        colorPrimary: '#3AA1A0',
        algorithm: true, // Enable algorithm
      },
      Card: {
        colorBgContainer: '#ffffff',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;