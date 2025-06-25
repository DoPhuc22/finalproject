import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cart";
import { getProductById, getProductImages } from "../services/products";
import { getCurrentUser } from "../services/auth";

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Function to dispatch cart update event
  const dispatchCartUpdate = useCallback(() => {
    const cartUpdateEvent = new CustomEvent("cartUpdated", {
      detail: {
        totalQuantity: cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        ),
        itemCount: cartItems.length,
        cartItems: cartItems,
      },
    });
    window.dispatchEvent(cartUpdateEvent);
    console.log("Cart update event dispatched");
  }, [cartItems]);

  // Validate user ID - check if it's a real ID or fake timestamp
  const isValidUserId = (userId) => {
    if (!userId) return false;
    const userIdStr = userId.toString();
    // Check if it's a 13-digit timestamp (fake ID)
    return !userIdStr.match(/^\d{13}$/);
  };

  // Kiểm tra authentication status và load profile
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setProfileLoading(true);

        const token =
          localStorage.getItem("token") || localStorage.getItem("accessToken");

        if (!token) {
          console.log("No token found");
          setIsAuthenticated(false);
          setCurrentUser(null);
          setProfileLoading(false);
          return;
        }

        // Luôn lấy thông tin user từ API để đảm bảo có ID thực
        console.log("Fetching user profile to ensure real user ID...");
        const userData = await getCurrentUser({ forceRefresh: true });

        if (userData && userData.id && isValidUserId(userData.id)) {
          console.log("Profile loaded successfully with real ID:", userData);
          setIsAuthenticated(true);
          setCurrentUser(userData);

          // Đảm bảo userData có ID đúng format
          if (!userData.userId && userData.id) {
            userData.userId = userData.id;
          }

          // Cập nhật localStorage với thông tin đầy đủ
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.log("No valid user data found or fake user ID");
          setIsAuthenticated(false);
          setCurrentUser(null);

          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuthenticated(false);
        setCurrentUser(null);

        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setProfileLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const handleStorageChange = () => {
      console.log("Storage change detected, re-initializing auth...");
      initializeAuth();
    };

    const handleUserLoggedIn = (event) => {
      console.log("User logged in event received:", event.detail);
      // Re-initialize để đảm bảo có ID thực
      setTimeout(() => {
        initializeAuth();
      }, 100);
    };

    const handleUserLoggedOut = () => {
      console.log("User logged out event received");
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCart(null);
      setCartItems([]);
      setProfileLoading(false);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
    };
  }, []);

  // Fetch product details including images for cart items
  const fetchProductDetails = async (productId) => {
    try {
      const [productResponse, imagesResponse] = await Promise.all([
        getProductById(productId),
        getProductImages(productId),
      ]);

      const productData = productResponse.data || productResponse;
      const imagesData = imagesResponse.data || imagesResponse || [];

      const primaryImage =
        imagesData.find((img) => img.isPrimary) || imagesData[0];

      return {
        id: productData.productId || productData.id,
        productId: productData.productId || productData.id,
        name: productData.name || "Unknown Product",
        price: productData.price || 0,
        imageUrl:
          primaryImage?.imageUrl ||
          productData.imageUrl ||
          "/assets/images/products/default.jpg",
        remainQuantity: productData.remainQuantity || 0,
        sku: productData.sku,
        brand: productData.brand,
        category: productData.category,
        description: productData.description,
        images: imagesData,
      };
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return {
        id: productId,
        productId: productId,
        name: "Unknown Product",
        price: 0,
        imageUrl: "/assets/images/products/default.jpg",
        remainQuantity: 0,
        sku: null,
        brand: null,
        category: null,
        description: null,
        images: [],
      };
    }
  };

  // Fetch cart data - chỉ chạy khi đã có currentUser với ID thực
  const fetchCart = useCallback(async () => {
    const userId = currentUser?.userId || currentUser?.id;

    if (!userId || !isValidUserId(userId)) {
      console.log("No valid user ID found for fetching cart:", userId);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching cart for valid user ID:", userId);

      const response = await getUserCart(userId);
      console.log("Cart API response:", response);

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

      console.log("Raw cart items from API:", itemsData);

      const itemsWithProductDetails = await Promise.all(
        itemsData.map(async (item) => {
          console.log("Processing cart item:", item);

          const productDetails = await fetchProductDetails(item.productId);

          return {
            itemId: item.itemId || item.id,
            productId: item.productId,
            quantity: item.quantity || 1,
            product: productDetails,
          };
        })
      );

      console.log(
        "Cart items with product details and images:",
        itemsWithProductDetails
      );

      setCart(cartData);
      setCartItems(itemsWithProductDetails);
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response?.status === 404) {
        console.log("User has no cart yet, setting empty cart");
        setCart(null);
        setCartItems([]);
      } else {
        setCart(null);
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load cart chỉ khi user đã được load xong và có ID thực
  useEffect(() => {
    if (!profileLoading && isAuthenticated && currentUser) {
      const userId = currentUser.userId || currentUser.id;
      if (isValidUserId(userId)) {
        console.log("Profile loaded with valid ID, now fetching cart...");
        fetchCart();
      } else {
        console.log("User ID is invalid/fake, not fetching cart");
        setCart(null);
        setCartItems([]);
      }
    } else if (!profileLoading && !isAuthenticated) {
      console.log("User not authenticated, clearing cart...");
      setCart(null);
      setCartItems([]);
    }
  }, [profileLoading, isAuthenticated, currentUser, fetchCart]);

  // Dispatch cart update event whenever cartItems changes
  useEffect(() => {
    if (!profileLoading && isAuthenticated) {
      dispatchCartUpdate();
    }
  }, [cartItems, isAuthenticated, profileLoading, dispatchCartUpdate]);

  // Add item to cart
  const addItemToCart = async (productData, quantity = 1) => {
    if (!isAuthenticated || !currentUser) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return false;
    }

    const userId = currentUser.userId || currentUser.id;
    if (!isValidUserId(userId)) {
      message.error("Lỗi thông tin tài khoản, vui lòng đăng nhập lại");
      return false;
    }

    try {
      setLoading(true);

      const cartItemData = {
        productId: productData.id || productData.productId,
        quantity: quantity,
      };

      console.log("Adding item to cart:", { userId, cartItemData });

      await addToCart(userId, cartItemData);
      message.success(`Đã thêm "${productData.name}" vào giỏ hàng`);

      await fetchCart();
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId, newQuantity) => {
    if (!isAuthenticated || !currentUser || newQuantity < 1) return;

    const userId = currentUser.userId || currentUser.id;
    if (!isValidUserId(userId)) {
      message.error("Lỗi thông tin tài khoản, vui lòng đăng nhập lại");
      return;
    }

    try {
      setLoading(true);

      const item = cartItems.find((i) => i.itemId === itemId);
      if (!item) throw new Error("Item not found in cart");

      const updateData = {
        itemId: item.itemId,
        productId: item.productId,
        quantity: newQuantity,
      };

      await updateCartItem(userId, updateData);

      setCartItems((prev) =>
        prev.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      message.success("Đã cập nhật số lượng sản phẩm");
    } catch (error) {
      console.error("Error updating cart item:", error);
      message.error("Có lỗi xảy ra khi cập nhật số lượng");
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (itemId) => {
    if (!isAuthenticated || !currentUser) return;

    const userId = currentUser.userId || currentUser.id;
    if (!isValidUserId(userId)) {
      message.error("Lỗi thông tin tài khoản, vui lòng đăng nhập lại");
      return;
    }

    try {
      setLoading(true);

      await removeCartItem(userId, itemId);

      setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));

      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing cart item:", error);
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearEntireCart = async () => {
    if (!isAuthenticated || !currentUser) return;

    const userId = currentUser.userId || currentUser.id;
    if (!isValidUserId(userId)) {
      message.error("Lỗi thông tin tài khoản, vui lòng đăng nhập lại");
      return;
    }

    try {
      setLoading(true);

      await clearCart(userId);

      setCart(null);
      setCartItems([]);

      message.success("Đã xóa toàn bộ giỏ hàng");
    } catch (error) {
      console.error("Error clearing cart:", error);
      message.error("Có lỗi xảy ra khi xóa giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  const shippingFee = 0;
  const total = subtotal + shippingFee;
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return {
    cart,
    cartItems,
    loading: loading || profileLoading,
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
    currentUser,
    profileLoading,
  };
};

export default useCart;
