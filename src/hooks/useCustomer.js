import { useState, useEffect, useCallback, useRef } from "react";
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

  const isFetchingAllRef = useRef(false);

  // Fetch all customers with filters
  const fetchCustomers = useCallback(async (params = {}) => {
    try {
      setLoading(true);

      // Kiểm tra params có rỗng hay không để xác định là getAllUsers
      const isFetchingAll = Object.keys(params).length === 0;
      isFetchingAllRef.current = isFetchingAll;

      if (isFetchingAll) {
        const cached = localStorage.getItem("customers");
        if (cached) {
          setCustomers(JSON.parse(cached));
          setPagination((prev) => ({
            ...prev,
            total: JSON.parse(cached).length,
          }));
          setLoading(false);
          return;
        }
      }

      const response = await getAllUsers(params);
      const data = response.data || response;

      // Filter and map customers (giữ nguyên phần bạn có sẵn)
      let customersOnly = data
        .filter((user) => user.role !== "admin")
        .map((customer) => ({
          ...customer,
          joinDate: customer.createdAt || new Date().toISOString(),
          orderCount: Math.floor(Math.random() * 20) + 1,
          totalSpent: Math.floor(Math.random() * 10000000) + 500000,
        }));

      // Áp dụng bộ lọc phía client (giữ nguyên)

      if (params.search) {
        const keywords = params.search
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(/\s+/);

        customersOnly = customersOnly.filter((customer) => {
          const name =
            customer.name
              ?.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") || "";
          const email = customer.email?.toLowerCase() || "";
          const phone = customer.phone || "";

          return keywords.every(
            (word) =>
              name.includes(word) ||
              email.includes(word) ||
              phone.includes(word)
          );
        });
      }

      if (params.status && params.status !== "all") {
        customersOnly = customersOnly.filter(
          (customer) => customer.status === params.status
        );
      }

      if (params.gender && params.gender !== "all") {
        customersOnly = customersOnly.filter(
          (customer) => customer.gender === params.gender
        );
      }

      if (params.dateRange && params.dateRange.start && params.dateRange.end) {
        customersOnly = customersOnly.filter((customer) => {
          if (!customer.joinDate) return false;
          const customerDate = new Date(customer.joinDate);
          const startDate = new Date(params.dateRange.start);
          const endDate = new Date(params.dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          return customerDate >= startDate && customerDate <= endDate;
        });
      }

      setCustomers(customersOnly);
      setPagination((prev) => ({
        ...prev,
        total: customersOnly.length,
      }));

      // Lưu vào localStorage nếu không có filter
      if (isFetchingAll) {
        localStorage.setItem("customers", JSON.stringify(customersOnly));
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Thêm useEffect để lắng nghe sự kiện beforeunload khi fetchCustomers được gọi với params rỗng (getAllUsers)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isFetchingAllRef.current) {
        localStorage.removeItem("customers");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Create customer
  const createCustomerHandler = async (customerData) => {
    try {
      console.log("Creating customer:", customerData); // Debug log

      // Ensure role is set to customer
      const dataWithRole = {
        ...customerData,
        role: customerData.role || "customer",
        status: customerData.status || "active",
      };

      const response = await createUser(dataWithRole);
      let createdCustomer;
      if (response && response.data) {
        createdCustomer = response.data;
      } else {
        createdCustomer = response;
      }

      const normalizedCustomer = {
        ...createdCustomer,
        created_at:
          createdCustomer.created_at ||
          createdCustomer.createdAt ||
          new Date().toISOString(),
        updated_at:
          createdCustomer.updated_at ||
          createdCustomer.updatedAt ||
          new Date().toISOString(),
        name: createdCustomer.name || dataWithRole.name,
        email: createdCustomer.email || dataWithRole.email,
        phone: createdCustomer.phone || dataWithRole.phone,
        address: createdCustomer.address || dataWithRole.address,
        gender: createdCustomer.gender || dataWithRole.gender,
        role: createdCustomer.role || dataWithRole.role,
        status: createdCustomer.status || dataWithRole.status,
      };
      message.success("Tạo khách hàng thành công!");
      setCustomers((prev) => {
        const newList = [normalizedCustomer, ...prev];
        localStorage.setItem("customers", JSON.stringify(newList));
        return newList;
      });
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return normalizedCustomer;
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

      // Cập nhật customer trong danh sách và đưa lên đầu
      setCustomers((prevCustomers) => {
        const updatedCustomers = prevCustomers.filter(
          (customer) => (customer.userId || customer.id) !== customerId
        );

        // Tạo customer đã cập nhật với dữ liệu mới
        const updatedCustomer = {
          ...prevCustomers.find(
            (customer) => (customer.userId || customer.id) === customerId
          ),
          ...customerData,
          userId: customerId,
          id: customerId,
          joinDate:
            prevCustomers.find(
              (customer) => (customer.userId || customer.id) === customerId
            )?.joinDate || new Date().toISOString(),
        };

        // Đưa customer đã cập nhật lên đầu danh sách
        const newList = [updatedCustomer, ...updatedCustomers];
        localStorage.setItem("customers", JSON.stringify(newList));
        return newList;
      });

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
      localStorage.removeItem("customers");
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
