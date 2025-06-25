import api from '../utils/request';

// API endpoints cho VNPay
const VNPAY_ENDPOINTS = {
  SUBMIT_ORDER: '/vnpay/submitOrder',
  PAYMENT_CALLBACK: '/vnpay/vnpay-payment'
};

// API 1: Gửi đơn hàng để thanh toán qua VNPay
export const submitOrderToVNPay = async (amount, orderInfo) => {
  try {
    console.log('Submitting order to VNPay:', { amount, orderInfo });
    
    // Validate input parameters
    if (!amount || amount <= 0) {
      throw new Error('Amount is required and must be greater than 0');
    }
    
    if (!orderInfo || !orderInfo.trim()) {
      throw new Error('Order info is required');
    }
    
    // Call API with query parameters
    const response = await api.post(VNPAY_ENDPOINTS.SUBMIT_ORDER, null, {
      params: {
        amount: amount,
        orderInfo: orderInfo
      }
    });
    
    console.log('VNPay submit order response:', response);
    
    // API trả về chuỗi URL để redirect
    if (typeof response === 'string') {
      return {
        success: true,
        paymentUrl: response,
        data: response
      };
    } else if (response && response.data && typeof response.data === 'string') {
      return {
        success: true,
        paymentUrl: response.data,
        data: response.data
      };
    } else {
      throw new Error('Invalid response format from VNPay API');
    }
    
  } catch (error) {
    console.error('VNPay submit order error:', error);
    
    // Handle different error types
    let errorMessage = 'Có lỗi xảy ra khi kết nối với VNPay';
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          errorMessage = 'Thông tin đơn hàng không hợp lệ';
          break;
        case 401:
          errorMessage = 'Không có quyền truy cập VNPay';
          break;
        case 403:
          errorMessage = 'Tài khoản VNPay bị từ chối';
          break;
        case 404:
          errorMessage = 'Dịch vụ VNPay không khả dụng';
          break;
        case 500:
          errorMessage = 'Lỗi hệ thống VNPay, vui lòng thử lại sau';
          break;
        default:
          errorMessage = data?.message || 'Lỗi không xác định từ VNPay';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      originalError: error
    };
  }
};

// API 2: Xử lý thanh toán VNPay (callback hoặc xác nhận)
export const processVNPayPayment = async (paymentParams = {}) => {
  try {
    console.log('Processing VNPay payment callback:', paymentParams);
    
    // Gọi API callback của VNPay
    const response = await api.get(VNPAY_ENDPOINTS.PAYMENT_CALLBACK, {
      params: paymentParams
    });
    
    console.log('VNPay payment callback response:', response);
    
    // Xử lý response
    let result = {
      success: false,
      transactionStatus: 'unknown',
      message: 'Không thể xác định trạng thái thanh toán',
      data: null
    };
    
    if (response) {
      // Nếu response là object rỗng hoặc có dữ liệu xác nhận
      if (typeof response === 'object') {
        result = {
          success: true,
          transactionStatus: response.transactionStatus || 'completed',
          message: response.message || 'Thanh toán thành công',
          transactionId: response.transactionId,
          orderId: response.orderId,
          amount: response.amount,
          responseCode: response.responseCode,
          data: response
        };
      } else if (response === 'success' || response === 'OK') {
        result = {
          success: true,
          transactionStatus: 'completed',
          message: 'Thanh toán thành công',
          data: response
        };
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('VNPay payment callback error:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán VNPay';
    let transactionStatus = 'failed';
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          errorMessage = 'Thông tin thanh toán không hợp lệ';
          break;
        case 401:
          errorMessage = 'Phiên thanh toán đã hết hạn';
          break;
        case 404:
          errorMessage = 'Không tìm thấy thông tin giao dịch';
          break;
        case 500:
          errorMessage = 'Lỗi hệ thống trong quá trình thanh toán';
          break;
        default:
          errorMessage = data?.message || 'Thanh toán thất bại';
      }
      
      // Kiểm tra mã phản hồi từ VNPay
      if (data && data.responseCode) {
        switch (data.responseCode) {
          case '00':
            transactionStatus = 'completed';
            errorMessage = 'Thanh toán thành công';
            break;
          case '07':
            transactionStatus = 'pending';
            errorMessage = 'Giao dịch đang được xử lý';
            break;
          case '09':
            transactionStatus = 'failed';
            errorMessage = 'Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ';
            break;
          case '10':
            transactionStatus = 'failed';
            errorMessage = 'Thông tin thẻ/tài khoản không chính xác';
            break;
          case '11':
            transactionStatus = 'failed';
            errorMessage = 'Thẻ/Tài khoản đã hết hạn';
            break;
          case '12':
            transactionStatus = 'failed';
            errorMessage = 'Thẻ/Tài khoản bị khóa';
            break;
          case '13':
            transactionStatus = 'failed';
            errorMessage = 'Sai mật khẩu thanh toán';
            break;
          case '24':
            transactionStatus = 'cancelled';
            errorMessage = 'Khách hàng hủy giao dịch';
            break;
          case '51':
            transactionStatus = 'failed';
            errorMessage = 'Tài khoản không đủ số dư';
            break;
          case '65':
            transactionStatus = 'failed';
            errorMessage = 'Tài khoản đã vượt quá hạn mức giao dịch';
            break;
          case '75':
            transactionStatus = 'failed';
            errorMessage = 'Ngân hàng thanh toán đang bảo trì';
            break;
          case '79':
            transactionStatus = 'failed';
            errorMessage = 'Giao dịch vượt quá số lần cho phép';
            break;
          default:
            transactionStatus = 'failed';
            errorMessage = `Thanh toán thất bại (Mã lỗi: ${data.responseCode})`;
        }
      }
    }
    
    return {
      success: false,
      transactionStatus: transactionStatus,
      message: errorMessage,
      error: error.message,
      originalError: error
    };
  }
};

// Helper function: Tạo thông tin đơn hàng cho VNPay
export const createOrderInfo = (orderData) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      items = []
    } = orderData;
    
    // Tạo mô tả ngắn gọn cho đơn hàng
    const itemCount = items.length;
    const firstItemName = items[0]?.name || 'Sản phẩm';
    
    let orderInfo = `Thanh toan don hang #${orderId}`;
    
    if (itemCount === 1) {
      orderInfo = `${firstItemName} - Don hang #${orderId}`;
    } else if (itemCount > 1) {
      orderInfo = `${firstItemName} va ${itemCount - 1} SP khac - Don hang #${orderId}`;
    }
    
    // Giới hạn độ dài thông tin đơn hàng (VNPay có giới hạn ký tự)
    if (orderInfo.length > 100) {
      orderInfo = orderInfo.substring(0, 97) + '...';
    }
    
    return orderInfo;
    
  } catch (error) {
    console.error('Error creating order info:', error);
    return `Thanh toan don hang - ${Date.now()}`;
  }
};

// Helper function: Validate VNPay response parameters
export const validateVNPayResponse = (params) => {
  const requiredParams = ['vnp_Amount', 'vnp_BankCode', 'vnp_ResponseCode'];
  const missingParams = [];
  
  for (const param of requiredParams) {
    if (!params[param]) {
      missingParams.push(param);
    }
  }
  
  return {
    isValid: missingParams.length === 0,
    missingParams: missingParams,
    responseCode: params.vnp_ResponseCode,
    isSuccess: params.vnp_ResponseCode === '00'
  };
};

// Helper function: Format amount for VNPay (VNPay expects amount in VND without decimal)
export const formatAmountForVNPay = (amount) => {
  // VNPay expects amount in VND (smallest unit), no decimal
  // If amount is in VND already, just remove decimal
  return Math.round(amount);
};

// Helper function: Parse VNPay amount back to display format
export const parseVNPayAmount = (vnpAmount) => {
  // VNPay amount is in VND, convert back to display format
  return parseInt(vnpAmount) || 0;
};

// Export all functions
export default {
  submitOrderToVNPay,
  processVNPayPayment,
  createOrderInfo,
  validateVNPayResponse,
  formatAmountForVNPay,
  parseVNPayAmount
};