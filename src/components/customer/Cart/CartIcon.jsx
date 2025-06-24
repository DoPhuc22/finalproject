import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useCart from "../../../hooks/useCart";

const CartIcon = () => {
  const { totalQuantity, isAuthenticated } = useCart();
  const [scrolled, setScrolled] = useState(false);
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
  if (!isAuthenticated) {
    return (
      <Link to="/auth">
        <Tooltip title="Đăng nhập để xem giỏ hàng">
          <Button type="text" icon={<ShoppingCartOutlined />} size="large" />
        </Tooltip>
      </Link>
    );
  }

  return (
    <Link to="/cart">
      <Tooltip title="Giỏ hàng">
        <Badge count={totalQuantity} showZero={false}>
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            className={`flex items-center justify-items-center ${scrolled ? "text-gray-700" : "text-white"}`}
            size="large"
          />
        </Badge>
      </Tooltip>
    </Link>
  );
};

export default CartIcon;
