import React from "react";
import { useDispatch } from "react-redux";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, InputNumber, Popconfirm, Tooltip } from "antd";
import {
  removeFromCart,
  updateQuantity,
} from "../../../store/slices/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    dispatch(updateQuantity({ id: item.id, quantity: value }));
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md shadow-sm"
        />
        <div>
          <h3 className="font-medium text-lg">{item.name}</h3>
          <p className="text-gray-500">{item.brand}</p>
          <p className="text-blue-600 font-semibold">
            {item.price.toLocaleString("de-DE")} VNĐ
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="border-blue-500 text-blue-500 hover:text-blue-700"
          />
          <InputNumber
            min={1}
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-16 mx-2"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="border-blue-500 text-blue-500 hover:text-blue-700"
          />
        </div>

        <p className="font-semibold w-24 text-right">
          {(item.price * item.quantity).toLocaleString("de-DE")} VNĐ
        </p>
        <Tooltip title="Xóa sản phẩm khỏi giỏ hàng">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
            onConfirm={handleRemoveItem}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
            />
          </Popconfirm>
        </Tooltip>
      </div>
    </div>
  );
};

export default CartItem;
