import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users";

const useCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch all customers with filters
  const fetchCustomers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllUsers(params);
      const data = response.data || response;

      // Filter only customers (not admin users) and add additional info
      const customersOnly = data
        .filter((user) => user.role !== "admin")
        .map((customer) => ({
          ...customer,
          joinDate: customer.createdAt || new Date().toISOString(),
          orderCount: Math.floor(Math.random() * 20) + 1, // Mock order count
          totalSpent: Math.floor(Math.random() * 10000000) + 500000, // Mock total spent
        }));

      setCustomers(customersOnly);
      setPagination((prev) => ({
        ...prev,
        total: customersOnly.length,
      }));
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create customer
  const createCustomerHandler = async (customerData) => {
    try {
      console.log("Creating customer:", customerData); // Debug log

      // Ensure role is set to customer
      const dataWithRole = {
        ...customerData,
        role: customerData.role || "customer",
      };

      const response = await createUser(dataWithRole);
      message.success("Tạo khách hàng thành công!");
      fetchCustomers(); // Refresh list
      return response;
    } catch (error) {
      console.error("Create customer error:", error);
      message.error("Lỗi khi tạo khách hàng");
      throw error;
    }
  };

  // Update customer
  const updateCustomerHandler = async (id, customerData) => {
    try {
      console.log("Updating customer:", { id, customerData }); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const customerId = typeof id === "object" ? id.userId || id.id : id;

      if (!customerId) {
        throw new Error("Customer ID is required for update");
      }

      const response = await updateUser(customerId, customerData);
      message.success("Cập nhật khách hàng thành công!");
      fetchCustomers(); // Refresh list
      return response;
    } catch (error) {
      console.error("Update customer error:", error);
      message.error("Lỗi khi cập nhật khách hàng");
      throw error;
    }
  };

  // Delete customer
  const deleteCustomerHandler = async (id) => {
    try {
      console.log("Deleting customer:", id); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const customerId = typeof id === "object" ? id.userId || id.id : id;

      if (!customerId) {
        throw new Error("Customer ID is required for delete");
      }

      await deleteUser(customerId);
      message.success("Xóa khách hàng thành công!");
      fetchCustomers(); // Refresh list
    } catch (error) {
      console.error("Delete customer error:", error);
      message.error("Lỗi khi xóa khách hàng");
      throw error;
    }
  };

  // Handle pagination change
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    const params = {
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      sortBy: sorter.field,
      sortOrder: sorter.order,
    };
    fetchCustomers(params);
  };

  // Initial load
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    pagination,
    fetchCustomers,
    createCustomer: createCustomerHandler,
    updateCustomer: updateCustomerHandler,
    deleteCustomer: deleteCustomerHandler,
    handleTableChange,
  };
};

export default useCustomer;
