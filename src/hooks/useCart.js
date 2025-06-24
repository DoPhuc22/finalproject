import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getUserCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cart';
import { getProductById, getProductImages } from '../services/products'; // Import thêm service để lấy ảnh

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Kiểm tra authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          const parsedUser = JSON.parse(user);
          setIsAuthenticated(true);
          setCurrentUser(parsedUser);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    window.addEventListener('userLoggedIn', checkAuth);
    window.addEventListener('userLoggedOut', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userLoggedIn', checkAuth);
      window.removeEventListener('userLoggedOut', checkAuth);
    };
  }, []);

  // Fetch product details including images for cart items
  const fetchProductDetails = async (productId) => {
    try {
      // Gọi song song API lấy thông tin sản phẩm và ảnh
      const [productResponse, imagesResponse] = await Promise.all([
        getProductById(productId),
        getProductImages(productId)
      ]);

      const productData = productResponse.data || productResponse;
      const imagesData = imagesResponse.data || imagesResponse || [];
      
      // Tìm ảnh chính (isPrimary = true) hoặc lấy ảnh đầu tiên
      const primaryImage = imagesData.find(img => img.isPrimary) || imagesData[0];
      
      return {
        id: productData.productId || productData.id,
        productId: productData.productId || productData.id,
        name: productData.name || 'Unknown Product',
        price: productData.price || 0,
        imageUrl: primaryImage?.imageUrl || productData.imageUrl || '/assets/images/products/default.jpg',
        remainQuantity: productData.remainQuantity || 0,
        sku: productData.sku,
        brand: productData.brand,
        category: productData.category,
        description: productData.description,
        images: imagesData // Lưu tất cả ảnh để sử dụng sau này nếu cần
      };
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return {
        id: productId,
        productId: productId,
        name: 'Unknown Product',
        price: 0,
        imageUrl: '/assets/images/products/default.jpg',
        remainQuantity: 0,
        sku: null,
        brand: null,
        category: null,
        description: null,
        images: []
      };
    }
  };

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!currentUser?.userId && !currentUser?.id) {
      return;
    }
    
    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id;
      console.log('Fetching cart for user:', userId);
      
      const response = await getUserCart(userId);
      console.log('Cart API response:', response);
      
      // Xử lý response từ API
      let cartData = null;
      let itemsData = [];

      if (response.data) {
        cartData = response.data;
        itemsData = response.data.items || [];
      } else if (response.items) {
        cartData = response;
        itemsData = response.items || [];
      } else if (Array.isArray(response)) {
        itemsData = response;
      }

      console.log('Raw cart items from API:', itemsData);

      // Fetch product details (including images) for each cart item
      const itemsWithProductDetails = await Promise.all(
        itemsData.map(async (item) => {
          console.log('Processing cart item:', item);
          
          // Lấy thông tin sản phẩm và ảnh từ API
          const productDetails = await fetchProductDetails(item.productId);
          
          return {
            itemId: item.itemId || item.id,
            productId: item.productId,
            quantity: item.quantity || 1,
            product: productDetails
          };
        })
      );

      console.log('Cart items with product details and images:', itemsWithProductDetails);

      setCart(cartData);
      setCartItems(itemsWithProductDetails);
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load cart when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log('User authenticated, fetching cart...');
      fetchCart();
    } else {
      console.log('User not authenticated, clearing cart...');
      setCart(null);
      setCartItems([]);
    }
  }, [isAuthenticated, currentUser, fetchCart]);

  // Add item to cart
  const addItemToCart = async (productData, quantity = 1) => {
    if (!isAuthenticated || !currentUser) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return false;
    }

    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id;
      
      const cartItemData = {
        productId: productData.id || productData.productId,
        quantity: quantity
      };

      console.log('Adding item to cart:', { userId, cartItemData });

      await addToCart(userId, cartItemData);
      message.success(`Đã thêm "${productData.name}" vào giỏ hàng`);
      
      // Refresh cart after adding
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId, newQuantity) => {
    if (!isAuthenticated || !currentUser || newQuantity < 1) return;

    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id;
      
      const updateData = {
        quantity: newQuantity
      };

      await updateCartItem(userId, itemId, updateData);
      
      // Update local state immediately for better UX
      setCartItems(prev => 
        prev.map(item => 
          item.itemId === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      message.success('Đã cập nhật số lượng sản phẩm');
    } catch (error) {
      console.error('Error updating cart item:', error);
      message.error('Có lỗi xảy ra khi cập nhật số lượng');
      // Refresh cart to get correct data
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (itemId) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id;
      
      await removeCartItem(userId, itemId);
      
      // Update local state immediately
      setCartItems(prev => prev.filter(item => item.itemId !== itemId));
      
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing cart item:', error);
      message.error('Có lỗi xảy ra khi xóa sản phẩm');
      // Refresh cart to get correct data
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearEntireCart = async () => {
    if (!isAuthenticated || !currentUser) return;

    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id;
      
      await clearCart(userId);
      
      setCart(null);
      setCartItems([]);
      
      message.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error) {
      console.error('Error clearing cart:', error);
      message.error('Có lỗi xảy ra khi xóa giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const shippingFee = 0; // Miễn phí vận chuyển
  const total = subtotal + shippingFee;
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cart,
    cartItems,
    loading,
    subtotal,
    shippingFee,
    total,
    totalQuantity,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearEntireCart,
    fetchCart,
    isAuthenticated,
    currentUser
  };
};

export default useCart;