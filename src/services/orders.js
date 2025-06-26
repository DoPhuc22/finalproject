import api from "../utils/request";

// API endpoints cho orders
const ORDER_ENDPOINTS = {
  BASE: "/orders",
  BY_ID: (id) => `/orders/${id}`,
  UPDATE_STATUS: (id) => `/orders/${id}/status`,
  CANCEL_OR_UPDATE: (id) => `/orders/${id}/cancel-or-update-receiver`,
};

// LocalStorage key for orders
const ORDERS_STORAGE_KEY = "orders_data";

// Helper functions for localStorage
const getOrdersFromStorage = () => {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading orders from localStorage:", error);
    return [];
  }
};

const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

// Lấy danh sách tất cả orders với filters
export const getAllOrders = async (params = {}) => {
  try {
    const response = await api.get(ORDER_ENDPOINTS.BASE, { params });

    // Update localStorage with API data
    if (response && response.data) {
      const apiData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      saveOrdersToStorage(apiData);
    }

    return response;
  } catch (error) {
    console.error("Get all orders API error:", error);

    // Fallback to localStorage
    const storedData = getOrdersFromStorage();
    return { data: storedData };
  }
};

export const cancelOrderOrUpdateReceiver = async (id, updateData) => {
  try {
    console.log("Cancel order or update receiver:", { id, updateData });

    // Validate input data
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Update data is required");
    }

    const payload = {};

    // Handle cancel operation
    if (updateData.cancel === true) {
      payload.cancel = true;
    } else {
      // Handle receiver info update
      if (updateData.receiverName) {
        payload.receiverName = updateData.receiverName;
      }
      if (updateData.receiverPhone) {
        payload.receiverPhone = updateData.receiverPhone;
      }
      if (updateData.receiverAddress) {
        payload.receiverAddress = updateData.receiverAddress;
      }
    }

    console.log("API payload:", payload);

    const response = await api.put(
      ORDER_ENDPOINTS.CANCEL_OR_UPDATE(id),
      payload
    );

    console.log("Cancel/update order response:", response);

    // Update localStorage cache
    const storedData = getOrdersFromStorage();
    const updatedData = storedData.map((order) => {
      if ((order.orderId || order.id) == id) {
        const updatedOrder = { ...order };

        if (updateData.cancel === true) {
          updatedOrder.status = "cancelled";
        } else {
          if (payload.receiverName)
            updatedOrder.receiverName = payload.receiverName;
          if (payload.receiverPhone)
            updatedOrder.receiverPhone = payload.receiverPhone;
          if (payload.receiverAddress)
            updatedOrder.shippingAddress = payload.receiverAddress;
        }

        updatedOrder.updatedAt = new Date().toISOString();
        return updatedOrder;
      }
      return order;
    });
    saveOrdersToStorage(updatedData);

    return response;
  } catch (error) {
    console.error("Cancel order or update receiver API error:", error);

    // Fallback to localStorage update only
    const storedData = getOrdersFromStorage();
    const updatedData = storedData.map((order) => {
      if ((order.orderId || order.id) == id) {
        const updatedOrder = { ...order };

        if (updateData.cancel === true) {
          updatedOrder.status = "cancelled";
        } else {
          if (updateData.receiverName)
            updatedOrder.receiverName = updateData.receiverName;
          if (updateData.receiverPhone)
            updatedOrder.receiverPhone = updateData.receiverPhone;
          if (updateData.receiverAddress)
            updatedOrder.shippingAddress = updateData.receiverAddress;
        }

        updatedOrder.updatedAt = new Date().toISOString();
        return updatedOrder;
      }
      return order;
    });
    saveOrdersToStorage(updatedData);

    const updatedOrder = updatedData.find(
      (order) => (order.orderId || order.id) == id
    );
    return { data: updatedOrder };
  }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    // Sử dụng getAllOrders với filter userId
    const response = await api.get(ORDER_ENDPOINTS.BASE, {
      params: { userId: userId },
    });

    console.log("Get user orders API response:", response);

    return response;
  } catch (error) {
    console.error("Get user orders API error:", error);

    // Fallback to localStorage
    const storedData = getOrdersFromStorage();
    const userOrders = storedData.filter(
      (order) => order.userId === userId || order.user_id === userId
    );

    console.log("Fallback to localStorage for user orders:", userOrders);
    return { data: userOrders };
  }
};

// Tạo order mới
export const createOrder = async (orderData) => {
  try {
    // Validate required fields trước khi gửi
    const requiredFields = [
      "userId",
      "details",
      "subtotal",
      "total",
      "paymentMethod",
      "shippingAddress",
      "receiverName",
      "receiverPhone",
    ];
    const missingFields = requiredFields.filter((field) => !orderData[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      throw new Error(`Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`);
    }

    // Validate specific fields
    if (!orderData.shippingAddress || orderData.shippingAddress.trim() === "") {
      throw new Error("Địa chỉ giao hàng không được để trống");
    }

    if (!orderData.receiverName || orderData.receiverName.trim() === "") {
      throw new Error("Tên người nhận không được để trống");
    }

    if (!orderData.receiverPhone || orderData.receiverPhone.trim() === "") {
      throw new Error("Số điện thoại người nhận không được để trống");
    }

    const payload = {
      userId: orderData.userId,
      details: orderData.details,
      subtotal: orderData.subtotal,
      total: orderData.total,
      status: orderData.status || "pending",
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress.trim(),
      receiverName: orderData.receiverName.trim(),
      receiverPhone: orderData.receiverPhone.trim(),
    };

    console.log("Creating order with validated payload:", payload);

    const response = await api.post(ORDER_ENDPOINTS.BASE, payload);
    console.log("Order creation response:", response);

    // Add to localStorage if successful
    if (response && response.data) {
      const newOrder = {
        ...response.data,
        orderId: response.data.orderId || response.data.id,
        orderDate: response.data.orderDate || new Date().toISOString(),
        updatedAt: response.data.updatedAt || new Date().toISOString(),
      };

      const storedData = getOrdersFromStorage();
      const updatedData = [newOrder, ...storedData];
      saveOrdersToStorage(updatedData);

      console.log("Order saved to localStorage:", newOrder);
    }

    return response;
  } catch (error) {
    console.error("Create order API error:", error);

    // Enhanced error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    // Provide specific error messages
    let errorMessage = "Không thể tạo đơn hàng. ";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage +=
            "Thông tin đơn hàng không hợp lệ: " +
            (data?.message || "Dữ liệu không đúng định dạng");
          break;
        case 401:
          errorMessage += "Bạn cần đăng nhập để tạo đơn hàng.";
          break;
        case 403:
          errorMessage += "Bạn không có quyền tạo đơn hàng.";
          break;
        case 404:
          errorMessage += "Không tìm thấy endpoint tạo đơn hàng.";
          break;
        case 500:
          errorMessage += "Lỗi hệ thống, vui lòng thử lại sau.";
          break;
        default:
          errorMessage += data?.message || `Mã lỗi: ${status}`;
      }
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += "Vui lòng kiểm tra kết nối mạng và thử lại.";
    }

    // Create enhanced error object
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.orderData = orderData; // Include the order data for debugging

    throw enhancedError;
  }
};

// Cập nhật order đầy đủ
export const updateOrder = async (id, orderData) => {
  try {
    const payload = {
      userId: orderData.userId,
      details: orderData.details,
      subtotal: orderData.subtotal,
      total: orderData.total,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      receiverName: orderData.receiverName,
      receiverPhone: orderData.receiverPhone,
    };

    const response = await api.put(ORDER_ENDPOINTS.BY_ID(id), payload);

    // Update localStorage
    const storedData = getOrdersFromStorage();
    const updatedData = storedData.map((order) => {
      if (order.orderId === id || order.id === id) {
        return {
          ...order,
          ...payload,
          orderId: id,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    });
    saveOrdersToStorage(updatedData);

    return response;
  } catch (error) {
    console.error("Update order API error:", error);
    throw error;
  }
};

// Lấy thông tin đơn hàng theo ID
export const getOrderById = async (id) => {
  try {
    console.log("Getting order details:", id);
    const response = await api.get(ORDER_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    console.error("Get order by ID API error:", error);

    // Fallback to localStorage
    const storedData = getOrdersFromStorage();
    const found = storedData.find(
      (order) => order.orderId === id || order.id === id
    );

    if (found) {
      return { data: found };
    }

    throw error;
  }
};

// Cập nhật trạng thái order
export const updateOrderStatus = async (id, status) => {
  try {
    console.log("Updating order status:", { id, status });
    
    // Đảm bảo status được gửi đi là string đơn giản, không phải JSON
    let statusValue = status;
    
    // Xử lý nếu status là JSON string
    if (typeof status === 'string' && status.startsWith('{') && status.includes('status')) {
      try {
        const parsedStatus = JSON.parse(status);
        if (parsedStatus && parsedStatus.status) {
          statusValue = parsedStatus.status;
        }
      } catch (error) {
        console.error("Error parsing status JSON:", error);
      }
    }
    
    // Đảm bảo statusValue là string cơ bản
    if (typeof statusValue === 'object' && statusValue.status) {
      statusValue = statusValue.status;
    }
    
    // Đảm bảo không tạo nested JSON
    statusValue = typeof statusValue === 'string' ? statusValue : String(statusValue);
    
    console.log("Final status value being sent:", statusValue);
    console.log("Type of status value:", typeof statusValue);
    
    // GỬI TRỰC TIẾP STRING, KHÔNG WRAP TRONG OBJECT
    // Thay vì gửi { status: statusValue }, gửi trực tiếp statusValue
    const response = await api.patch(ORDER_ENDPOINTS.UPDATE_STATUS(id), statusValue, {
      headers: {
        'Content-Type': 'text/plain'  // Đảm bảo gửi dưới dạng text
      }
    });
    
    // Update localStorage
    const storedData = getOrdersFromStorage();
    const updatedData = storedData.map(order => {
      if (order.orderId === id || order.id === id) {
        return {
          ...order,
          status: statusValue,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    saveOrdersToStorage(updatedData);
    
    return response;
  } catch (error) {
    console.error("Update order status API error:", error);
    throw error;
  }
};

// Xóa order
export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(ORDER_ENDPOINTS.BY_ID(id));

    // Remove from localStorage
    const storedData = getOrdersFromStorage();
    const filteredData = storedData.filter(
      (order) => order.orderId !== id && order.id !== id
    );
    saveOrdersToStorage(filteredData);

    return response;
  } catch (error) {
    console.error("Delete order API error:", error);

    // Fallback to localStorage delete
    const storedData = getOrdersFromStorage();
    const filteredData = storedData.filter(
      (order) => order.orderId !== id && order.id !== id
    );
    saveOrdersToStorage(filteredData);

    return { success: true };
  }
};

// Clear localStorage (for development/testing)
export const clearOrdersStorage = () => {
  localStorage.removeItem(ORDERS_STORAGE_KEY);
};
