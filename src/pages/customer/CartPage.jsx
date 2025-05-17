import React from 'react';
import { useSelector } from 'react-redux';
import CartItem from '../../components/customer/Cart/CartItem';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">Giỏ hàng của bạn đang trống.</p>
          <Link to="/products" className="text-verdigris-500 hover:text-verdigris-600 hover:no-underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Tổng cộng: {totalAmount.toLocaleString()} VNĐ</h2>
            <Link to="/checkout" className="mt-4 inline-block bg-verdigris-500 text-white py-2 px-4 rounded hover:bg-verdigris-600 hover:no-underline">
              Thanh toán
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;