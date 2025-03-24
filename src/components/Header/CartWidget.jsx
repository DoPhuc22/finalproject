import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartWidget = () => {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <Link to="/cart" className="relative">
      <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
      {cartItems.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
};

export default CartWidget;