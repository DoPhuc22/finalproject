import api from '../utils/request';
import { createOrder } from './orders';
import { clearCart } from './cart';

// API endpoints cho checkout
const CHECKOUT_ENDPOINTS = {
  BASE: '/checkout',
  VNPAY_CONFIRM: '/checkout/vnpay-confirm'
};

// Thực hiện checkout COD
export const processCheckout = async (checkoutData) => {
  try {
    console.log('Processing checkout:', checkoutData);
    
    if (checkoutData.paymentMethod === 'vnpay') {
      // Xử lý checkout VNPay
      return await processVNPayCheckout(checkoutData);
    } else {
      // Xử lý checkout COD
      const response = await api.post(CHECKOUT_ENDPOINTS.BASE, {
        paymentMethod: checkoutData.paymentMethod,
        shippingAddress: checkoutData.shippingAddress,
        receiverName: checkoutData.receiverName,
        receiverPhone: checkoutData.receiverPhone
      });
      return response;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

// Xử lý checkout VNPay
const processVNPayCheckout = async (checkoutData) => {
  try {
    console.log('Processing VNPay checkout:', checkoutData);
    
    // Validate VNPay data
    if (!checkoutData.vnpayData || checkoutData.vnpayData.vnp_ResponseCode !== '00') {
      throw new Error('Thanh toán VNPay không thành công');
    }
    
    // Tạo order từ orderData
    if (checkoutData.orderData) {
      // Cập nhật trạng thái thành "confirmed" vì đã thanh toán
      checkoutData.orderData.status = 'confirmed';
      
      console.log('Creating order after VNPay payment:', checkoutData.orderData);
      const orderResponse = await createOrder(checkoutData.orderData);
      
      if (orderResponse && (orderResponse.data || orderResponse.orderId)) {
        // Xóa giỏ hàng sau khi tạo order thành công
        try {
          const userId = checkoutData.orderData.userId;
          if (userId) {
            await clearCart(userId);
            console.log('Cart cleared after VNPay checkout');
          }
        } catch (clearError) {
          console.warn('Warning: Could not clear cart after VNPay checkout:', clearError);
        }
        
        return orderResponse;
      } else {
        throw new Error('Không thể tạo đơn hàng sau thanh toán');
      }
    } else {
      throw new Error('Không tìm thấy thông tin đơn hàng');
    }
    
  } catch (error) {
    console.error('VNPay checkout error:', error);
    throw error;
  }
};

// Xác nhận thanh toán VNPay (nếu cần API riêng)
export const confirmVNPayPayment = async (vnpayParams) => {
  try {
    const response = await api.post(CHECKOUT_ENDPOINTS.VNPAY_CONFIRM, vnpayParams);
    return response;
  } catch (error) {
    console.error('VNPay confirmation error:', error);
    throw error;
  }
};