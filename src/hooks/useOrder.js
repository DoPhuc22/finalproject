import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder as deleteOrderAPI,
  getOrderById,
} from "../services/orders";

const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} của ${total} đơn hàng`,
  });

  const recentlyUpdatedRef = useRef(new Set());

  // Sort data with priority for recently updated
  const sortData = useCallback((data, sortField = "updatedAt", sortOrder = "desc") => {
    return [...data].sort((a, b) => {
      const aId = a.orderId || a.id;
      const bId = b.orderId || b.id;

      // Priority for recently updated items
      const aIsRecent = recentlyUpdatedRef.current.has(aId);
      const bIsRecent = recentlyUpdatedRef.current.has(bId);

      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;

      // Normal sorting
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, []);

  // Fetch orders with filters
  const fetchOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllOrders(params);
      console.log("Orders response:", response);

      // Handle different API response structures
      let data = [];
      if (response && response.data) {
        data = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        data = response;
      }

      // Apply filters if provided
      if (params.search) {
        data = data.filter((order) =>
          order.orderId?.toString().toLowerCase().includes(params.search.toLowerCase()) ||
          order.receiverName?.toLowerCase().includes(params.search.toLowerCase()) ||
          order.receiverPhone?.includes(params.search)
        );
      }

      if (params.status && params.status !== "all") {
        data = data.filter((order) => order.status === params.status);
      }

      if (params.paymentMethod && params.paymentMethod !== "all") {
        data = data.filter((order) => order.paymentMethod === params.paymentMethod);
      }

      if (params.dateRange && params.dateRange.length === 2) {
        const [startDate, endDate] = params.dateRange;
        data = data.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      // Normalize data structure
            // Normalize data structure
      const normalizedData = data.map(order => ({
        orderId: order.orderId || order.id,
        userId: order.userId || order.user_id,
        details: order.details || [],
        subtotal: order.subtotal || 0,
        total: order.total || 0,
        status: order.status || 'pending',
        paymentMethod: order.paymentMethod || order.payment_method,
        shippingAddress: order.shippingAddress || order.shipping_address,
        receiverName: order.receiverName || order.receiver_name,
        receiverPhone: order.receiverPhone || order.receiver_phone,
        orderDate: order.orderDate || order.order_date || order.created_at,
        updatedAt: order.updatedAt || order.updated_at
      }));

      // Sort data
      const sortedData = sortData(normalizedData, "updatedAt", "desc");

      setOrders(sortedData);
      setPagination((prev) => ({
        ...prev,
        total: sortedData.length,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Lỗi khi tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [sortData]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
  try {
    setLoading(true);
    console.log("Updating order status:", { orderId, newStatus });

    await updateOrderStatus(orderId, newStatus);
    message.success("Cập nhật trạng thái đơn hàng thành công!");

    // Mark as recently updated
    recentlyUpdatedRef.current.add(orderId);

    // Update order in the list and move to the beginning
    setOrders(prev => {
      const updatedList = prev.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return order;
      });
      
      // Sort again to move updated item to top
      return sortData(updatedList, "updatedAt", "desc");
    });

    return true;
  } catch (error) {
    console.error("Update order status error:", error);
    
    // Hiển thị lỗi chi tiết
    message.error(error.message || "Lỗi khi cập nhật trạng thái đơn hàng");
    
    return false;
  } finally {
    setLoading(false);
  }
};

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await deleteOrderAPI(orderId);
      message.success("Xóa đơn hàng thành công!");

      // Remove order from the list
      setOrders(prev => 
        prev.filter(order => order.orderId !== orderId)
      );

      // Remove from recently updated set
      recentlyUpdatedRef.current.delete(orderId);

      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Delete order error:", error);
      message.error("Lỗi khi xóa đơn hàng");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get order details
  const getOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);
      return response.data;
    } catch (error) {
      console.error("Get order details error:", error);
      message.error("Lỗi khi tải thông tin đơn hàng");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle table pagination and sorting
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    
    if (sorter && sorter.field) {
      const sortedData = sortData(orders, sorter.field, sorter.order || "desc");
      setOrders(sortedData);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    pagination,
    fetchOrders,
    updateStatus,
    deleteOrder,
    getOrderDetails,
    handleTableChange,
  };
};

export default useOrder;