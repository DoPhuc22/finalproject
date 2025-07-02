import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  getAllUsers,
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
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: "updated_at",
    order: "desc",
  });

  const isFetchingAllRef = useRef(false);
  const recentlyUpdatedRef = useRef(new Set());

  // Hàm sắp xếp dữ liệu với priority cho recently updated
  const sortData = useCallback(
    (data, sortField = "updated_at", sortOrder = "desc") => {
      return [...data].sort((a, b) => {
        const aId = a.userId || a.id;
        const bId = b.userId || b.id;

        // Recently updated items always come first
        const aIsRecent = recentlyUpdatedRef.current.has(aId);
        const bIsRecent = recentlyUpdatedRef.current.has(bId);

        if (aIsRecent && !bIsRecent) return -1;
        if (!aIsRecent && bIsRecent) return 1;

        // Then sort by specified field
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "created_at" || sortField === "updated_at") {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        } else if (sortField === "name") {
          aValue = (aValue || "").toLowerCase();
          bValue = (bValue || "").toLowerCase();
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = (bValue || "").toLowerCase();
        }

        if (sortOrder === "desc") {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    },
    []
  );

  // Fetch customers with filters
  const fetchCustomers = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);

        const isFetchingAll = Object.keys(params).length === 0;
        isFetchingAllRef.current = isFetchingAll;

        if (isFetchingAll) {
          const cached = localStorage.getItem("customers");
          if (cached) {
            const cachedData = JSON.parse(cached);
            const sortedData = sortData(
              cachedData,
              sortConfig.field,
              sortConfig.order
            );
            setCustomers(sortedData);
            setPagination((prev) => ({
              ...prev,
              total: sortedData.length,
            }));
            setLoading(false);
            return;
          }
        }

        const response = await getAllUsers(params);
        const data = response.data || response;

        // Normalize data with proper date handling
        const normalizedData = data.map((user) => ({
          userId: user.userId || user.id,
          id: user.userId || user.id,
          name: user.name || user.username,
          email: user.email,
          phone: user.phone,
          role: user.role || "customer",
          status: user.status || "active",
          gender: user.gender,
          address: user.address || "",
          created_at:
            user.created_at || user.createdAt || new Date().toISOString(),
          updated_at:
            user.updated_at || user.updatedAt || new Date().toISOString(),
        }));

        // Merge with localStorage to preserve recently updated items
        const existingData = JSON.parse(
          localStorage.getItem("customers") || "[]"
        );
        const mergedData = normalizedData.map((item) => {
          const existing = existingData.find(
            (e) => (e.userId || e.id) === (item.userId || item.id)
          );
          return existing ? { ...item, ...existing } : item;
        });

        // Apply filters
        let filteredData = mergedData;

        if (params.search) {
          filteredData = filteredData.filter(
            (customer) =>
              customer.name
                ?.toLowerCase()
                .includes(params.search.toLowerCase()) ||
              customer.email
                ?.toLowerCase()
                .includes(params.search.toLowerCase()) ||
              customer.phone?.includes(params.search)
          );
        }

        if (params.status && params.status !== "all") {
          filteredData = filteredData.filter(
            (customer) => customer.status === params.status
          );
        }

        if (params.role && params.role !== "all") {
          filteredData = filteredData.filter(
            (customer) => customer.role === params.role
          );
        }

        const sortedData = sortData(
          filteredData,
          sortConfig.field,
          sortConfig.order
        );

        setCustomers(sortedData);
        setPagination((prev) => ({
          ...prev,
          total: sortedData.length,
        }));

        if (isFetchingAll) {
          localStorage.setItem("customers", JSON.stringify(sortedData));
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("Lỗi khi tải danh sách khách hàng");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    },
    [sortData, sortConfig]
  );

  // Create customer
  const createCustomerHandler = async (customerData) => {
    try {
      // Validate dữ liệu trước khi gửi
      if (!customerData.name?.trim()) {
        throw new Error("Tên khách hàng không được để trống");
      }

      if (!customerData.email?.trim()) {
        throw new Error("Email không được để trống");
      }

      if (!customerData.password || customerData.password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      }

      // Clean và validate dữ liệu
      const cleanedData = {
        name: customerData.name.trim(),
        email: customerData.email.trim(),
        phone: customerData.phone?.trim() || "",
        password: customerData.password,
        role: customerData.role || "customer",
        status: customerData.status || "active",
        gender: customerData.gender || "M",
        address: customerData.address?.trim() || "",
      };

      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === undefined || cleanedData[key] === null) {
          if (key !== "address" && key !== "password") {
            delete cleanedData[key];
          }
        }
        if (
          cleanedData[key] === "" &&
          key !== "address" &&
          key !== "password"
        ) {
          delete cleanedData[key];
        }
      });

      const response = await createUser(cleanedData);
      let createdCustomer;
      if (response && response.data) {
        createdCustomer = response.data;
      } else {
        createdCustomer = response;
      }

      const normalizedCustomer = {
        userId: createdCustomer.userId || createdCustomer.id,
        id: createdCustomer.userId || createdCustomer.id,
        name: createdCustomer.name || createdCustomer.username,
        email: createdCustomer.email,
        phone: createdCustomer.phone,
        role: createdCustomer.role || "customer",
        status: createdCustomer.status || "active",
        gender: createdCustomer.gender,
        address: createdCustomer.address || "",
        created_at: createdCustomer.created_at || new Date().toISOString(),
        updated_at: createdCustomer.updated_at || new Date().toISOString(),
      };

      message.success("Tạo khách hàng thành công!");

      // Mark as recently updated
      const customerId = normalizedCustomer.userId || normalizedCustomer.id;
      recentlyUpdatedRef.current.add(customerId);

      setCustomers((prev) => {
        const newList = [normalizedCustomer, ...prev];
        const sortedList = sortData(
          newList,
          sortConfig.field,
          sortConfig.order
        );
        localStorage.setItem("customers", JSON.stringify(sortedList));
        return sortedList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));

      return normalizedCustomer;
    } catch (error) {
      console.error("Create customer error:", error);

      // Parse error message
      let errorMessage = "Lỗi khi tạo khách hàng không xác định";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific errors
      if (
        errorMessage.includes("email") &&
        (errorMessage.includes("exists") || errorMessage.includes("already"))
      ) {
        errorMessage = "Email đã tồn tại trong hệ thống";
      } else if (
        errorMessage.includes("phone") &&
        (errorMessage.includes("exists") || errorMessage.includes("already"))
      ) {
        errorMessage = "Số điện thoại đã tồn tại trong hệ thống";
      } else if (
        errorMessage.includes("validation") ||
        errorMessage.includes("invalid")
      ) {
        errorMessage = "Dữ liệu không hợp lệ, vui lòng kiểm tra lại";
      }

      message.error(errorMessage);
      throw error;
    }
  };

  // Update customer
  const updateCustomerHandler = async (id, customerData) => {
    try {
      const customerId = typeof id === "object" ? id.userId || id.id : id;

      if (!customerId) {
        throw new Error("Customer ID is required for update");
      }

      const response = await updateUser(customerId, customerData);
      message.success("Cập nhật khách hàng thành công!");

      const existingCustomer = customers.find(
        (c) => (c.userId || c.id) === customerId
      );

      // Create normalized updated item with preserved data
      const normalizedItem = {
        ...existingCustomer,
        ...customerData,
        userId: customerId,
        id: customerId,
        updated_at: new Date().toISOString(),
      };

      // Mark as recently updated
      recentlyUpdatedRef.current.add(customerId);

      setCustomers((prevCustomers) => {
        // Remove the updated item from current position
        const updatedList = prevCustomers.filter(
          (customer) => (customer.userId || customer.id) !== customerId
        );
        // Add updated item to the beginning
        const newList = [normalizedItem, ...updatedList];
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
      const customerId = typeof id === "object" ? id.userId || id.id : id;
      if (!customerId) throw new Error("Customer ID required");

      await deleteUser(customerId);
      message.success("Xóa khách hàng thành công!");

      // Remove from recently updated
      recentlyUpdatedRef.current.delete(customerId);

      setCustomers((prev) => {
        const filteredList = prev.filter(
          (customer) => (customer.userId || customer.id) !== customerId
        );
        localStorage.setItem("customers", JSON.stringify(filteredList));
        return filteredList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Delete customer error:", error);
      message.error("Lỗi khi xóa khách hàng");
      throw error;
    }
  };

  // Handle table pagination and sorting
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);

    if (sorter && sorter.field) {
      const newSortConfig = {
        field: sorter.field,
        order: sorter.order || "desc",
      };
      setSortConfig(newSortConfig);

      setCustomers((prev) =>
        sortData(prev, newSortConfig.field, newSortConfig.order)
      );
    }

    setFilters(filters);
  };

  // Filter customers
  const filterCustomers = useCallback(
    (filterParams) => {
      setFilters(filterParams);
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchCustomers(filterParams);
    },
    [fetchCustomers]
  );

  // Clear recently updated after some time
  useEffect(() => {
    const interval = setInterval(() => {
      recentlyUpdatedRef.current.clear();
    }, 30000); // Clear after 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isFetchingAllRef.current) {
        localStorage.removeItem("customers");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    pagination,
    filters,
    sortConfig,
    fetchCustomers,
    createCustomer: createCustomerHandler,
    updateCustomer: updateCustomerHandler,
    deleteCustomer: deleteCustomerHandler,
    handleTableChange,
    filterCustomers,
  };
};

export default useCustomer;
