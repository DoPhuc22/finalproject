import api from "../utils/request";

// API endpoints cho statistics
const STATISTICS_ENDPOINTS = {
  RECENT_ORDERS: "/statistics/recent-orders",
  DASHBOARD: "/statistics/dashboard",
  CATEGORY_PERCENTAGES: "/statistics/category-percentages"
};

/**
 * Lấy dữ liệu đơn hàng gần đây
 * @returns {Promise<Array>} Mảng các đơn hàng gần đây theo định dạng mới
 */
export const getRecentOrders = async () => {
  try {
    const response = await api.get(STATISTICS_ENDPOINTS.RECENT_ORDERS);
    return response;
  } catch (error) {
    console.error("Get recent orders statistics error:", error);
    
    // Fallback: Return empty array if API fails
    return { data: [] };
  }
};

/**
 * Lấy dữ liệu tổng quan cho dashboard
 * @returns {Promise<Object>} Dữ liệu tổng quan dashboard với định dạng mới
 */
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get(STATISTICS_ENDPOINTS.DASHBOARD);
    return response;
  } catch (error) {
    console.error("Get dashboard statistics error:", error);
    
    // Fallback: Return empty dashboard data if API fails
    return { 
      data: {
        revenue: {
          yesterday: 0,
          today: 0,
          percent: 0
        },
        newUsers: {
          yesterday: 0,
          today: 0,
          percent: 0
        },
        orders: {
          yesterday: 0,
          today: 0,
          percent: 0
        },
        productsSold: {
          yesterday: 0,
          today: 0,
          percent: 0
        }
      } 
    };
  }
};

/**
 * Lấy tỷ lệ phần trăm theo danh mục
 * @returns {Promise<Array>} Mảng các đối tượng chứa thông tin tỷ lệ phần trăm theo danh mục
 */
export const getCategoryPercentages = async () => {
  try {
    const response = await api.get(STATISTICS_ENDPOINTS.CATEGORY_PERCENTAGES);
    return response;
  } catch (error) {
    console.error("Get category percentages error:", error);
    
    // Fallback: Return empty array if API fails
    return { data: [] };
  }
};

export default {
  getRecentOrders,
  getDashboardStatistics,
  getCategoryPercentages
};