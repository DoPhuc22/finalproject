import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useCart from "../../../hooks/useCart";

const CartIcon = () => {
  const { totalQuantity, isAuthenticated, loading } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [displayQuantity, setDisplayQuantity] = useState(0);

  // Handle scroll effect
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

  // Update display quantity when totalQuantity changes
  useEffect(() => {
    if (isAuthenticated) {
      setDisplayQuantity(totalQuantity);
    } else {
      setDisplayQuantity(0);
    }
  }, [totalQuantity, isAuthenticated]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = (event) => {
      console.log('CartIcon - Cart update event received:', event.detail);
      if (event.detail && typeof event.detail.totalQuantity === 'number') {
        setDisplayQuantity(event.detail.totalQuantity);
      }
    };

    const handleUserLoggedIn = () => {
      setTimeout(() => {
        setDisplayQuantity(totalQuantity);
      }, 100000);
    };

    const handleUserLoggedOut = () => {
      setDisplayQuantity(0);
    };

    // Listen for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, [totalQuantity]);

  // Debug log
  useEffect(() => {
    console.log('CartIcon state:', { 
      isAuthenticated, 
      totalQuantity, 
      displayQuantity, 
      loading 
    });
  }, [isAuthenticated, totalQuantity, displayQuantity, loading]);

  if (!isAuthenticated) {
    return (
      <Link to="/auth">
        <Tooltip title="Đăng nhập để xem giỏ hàng">
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            size="large"
            className={`flex items-center justify-items-center ${scrolled ? "text-gray-700" : "text-white"}`}
          />
        </Tooltip>
      </Link>
    );
  }

  return (
    <Link to="/cart">
      <Tooltip title={`Giỏ hàng (${displayQuantity} sản phẩm)`}>
        <Badge 
          count={displayQuantity} 
          showZero={false}
          className="cart-badge"
        >
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            className={`flex items-center justify-items-center ${scrolled ? "text-gray-700" : "text-white"}`}
            size="large"
            loading={loading && displayQuantity === 0}
          />
        </Badge>
      </Tooltip>
    </Link>
  );
};

export default CartIcon;