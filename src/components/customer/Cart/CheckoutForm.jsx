import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Steps,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import { createOrder } from "../../../services/orders";
import { submitOrderToVNPay, createOrderInfo } from "../../../services/vnpay";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  // Thêm state để store form values manually
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const {
    cartItems,
    total,
    subtotal,
    shippingFee,
    isAuthenticated,
    clearEntireCart,
  } = useCart();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setInitialLoading(true);

        // Lấy thông tin người dùng từ localStorage thay vì API
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        if (!userData || !userData.id) {
          message.error("Không thể lấy thông tin người dùng");
          return;
        }

        console.log("User data from localStorage:", userData);
        setCurrentUser(userData);

        // Set initial form data
        const initialData = {
          name: userData.name || "",
          phone: userData.phone || "",
          address: userData.address || "",
        };

        setFormData(initialData);

        // Set form values
        setTimeout(() => {
          form.setFieldsValue(initialData);
          console.log("Form values after setting:", form.getFieldsValue());
        }, 100);
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [form, isAuthenticated]);

  // Handle form field changes to update formData state
  const handleFieldChange = (field, value) => {
    console.log(`Field ${field} changed to:`, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Force re-render when step changes to update form values display
  useEffect(() => {
    console.log("Step changed to:", currentStep);
    if (currentStep === 2) {
      const values = form.getFieldsValue();
      console.log("Step 2 - Current form values:", values);
      console.log("Step 2 - FormData state:", formData);

      // Nếu form values rỗng, thử restore từ formData
      if (
        !values.name &&
        !values.phone &&
        !values.address &&
        (formData.name || formData.phone || formData.address)
      ) {
        console.log("Restoring form values from formData");
        form.setFieldsValue(formData);
      }
    }
  }, [currentStep, form, formData]);

  const steps = [
    {
      title: "Thông tin giao hàng",
      icon: <UserOutlined />,
    },
    {
      title: "Phương thức thanh toán",
      icon: <CreditCardOutlined />,
    },
    {
      title: "Xác nhận đơn hàng",
      icon: <CheckCircleOutlined />,
    },
  ];



  const handleFormSubmit = async (values) => {
  setLoading(true);
  try {
    console.log("Starting checkout process...");
    console.log("Form values received from onFinish:", values);
    console.log("FormData state:", formData);

    // Sử dụng formData state thay vì form values
    const finalFormValues = {
      name: formData.name || values?.name || "",
      phone: formData.phone || values?.phone || "",
      address: formData.address || values?.address || "",
    };

    console.log("Final form values to use:", finalFormValues);

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      message.error(
        "Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán."
      );
      return;
    }

    // Validate user data
    if (!currentUser || !currentUser.id) {
      message.error(
        "Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại."
      );
      return;
    }

    // Validate form data chi tiết
    const missingFields = [];
    if (!finalFormValues.name || finalFormValues.name.trim() === "")
      missingFields.push("Họ tên");
    if (!finalFormValues.phone || finalFormValues.phone.trim() === "")
      missingFields.push("Số điện thoại");
    if (!finalFormValues.address || finalFormValues.address.trim() === "")
      missingFields.push("Địa chỉ");

    if (missingFields.length > 0) {
      console.error("Missing form fields:", missingFields);
      message.error(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}`);

      // Chuyển về step đầu tiên để người dùng điền thông tin
      setCurrentStep(0);
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(finalFormValues.phone.trim())) {
      message.error(
        "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số."
      );
      setCurrentStep(0);
      return;
    }

    // Chuẩn bị dữ liệu đơn hàng - ĐẢM BẢO không null
    const orderData = {
      userId: currentUser.id || currentUser.userId,
      details: cartItems.map((item) => ({
        orderDetailId: null, // Will be generated by backend
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity,
      })),
      subtotal: subtotal,
      total: total,
      status: "pending",
      paymentMethod: paymentMethod,
      shippingAddress: finalFormValues.address.trim(),
      receiverName: finalFormValues.name.trim(),
      receiverPhone: finalFormValues.phone.trim(),
    };

    console.log("Order data prepared:", orderData);

    // LUỒNG THANH TOÁN COD - tạo đơn hàng ngay
    if (paymentMethod === "cod") {
      try {
        // Validate order data trước khi gửi
        if (
          !orderData.shippingAddress ||
          !orderData.receiverName ||
          !orderData.receiverPhone
        ) {
          console.error("Order data validation failed:", {
            shippingAddress: orderData.shippingAddress,
            receiverName: orderData.receiverName,
            receiverPhone: orderData.receiverPhone,
          });
          throw new Error(
            "Dữ liệu đơn hàng không đầy đủ. Vui lòng kiểm tra lại thông tin."
          );
        }

        // Tạo đơn hàng COD - PHẢI thành công để tiếp tục
        const orderResponse = await createOrder(orderData);
        console.log("Order response received:", orderResponse);

        // Validate response structure
        if (!orderResponse) {
          throw new Error("Server không trả về response");
        }

        // Check for different response structures
        let createdOrder = null;
        if (orderResponse.data) {
          createdOrder = orderResponse.data;
        } else if (orderResponse.orderId || orderResponse.id) {
          createdOrder = orderResponse;
        } else {
          console.error("Invalid order response structure:", orderResponse);
          throw new Error("Server trả về dữ liệu không hợp lệ");
        }

        // Validate order ID
        const orderId = createdOrder.orderId || createdOrder.id;
        if (!orderId) {
          console.error("No order ID found in response:", createdOrder);
          throw new Error("Server không trả về mã đơn hàng");
        }

        console.log("Order created successfully with ID:", orderId);
        message.success(`Đơn hàng #${orderId} đã được tạo thành công!`);

        // COD - Thanh toán khi nhận hàng
        message.success(
          "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng."
        );

        try {
          // Xóa giỏ hàng sau khi đặt hàng thành công
          await clearEntireCart();
        } catch (clearError) {
          console.warn("Warning: Could not clear cart:", clearError);
          // Không throw error vì đơn hàng đã tạo thành công
        }

        // Chuyển hướng đến trang thành công
        navigate("/order-success", {
          state: {
            orderId: orderId,
            paymentMethod: "cod",
            total: total,
          },
        });
      } catch (error) {
        console.error("COD checkout error:", error);
        throw error; // Ném lỗi để xử lý ở catch bên ngoài
      }
    } 
    // LUỒNG THANH TOÁN VNPAY - không tạo đơn hàng ngay
    else if (paymentMethod === "vnpay") {
  try {
    // Tạo ID đơn hàng tạm thời - sẽ được thay thế bởi ID thật sau khi thanh toán
    const tempOrderId = `TEMP_${Date.now()}_${currentUser.id}`;
    
    // Tạo thông tin đơn hàng cho VNPay
    const vnpayOrderInfo = createOrderInfo({
      orderId: tempOrderId,
      customerName: finalFormValues.name.trim(),
      customerPhone: finalFormValues.phone.trim(),
      totalAmount: total,
      items: cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    });

    console.log("VNPay order info:", vnpayOrderInfo);

    // Lưu thông tin đơn hàng tạm thời vào sessionStorage để sử dụng sau khi thanh toán
    const pendingOrder = {
      tempOrderId: tempOrderId,
      amount: total,
      orderInfo: vnpayOrderInfo,
      timestamp: new Date().toISOString(),
      paymentMethod: "vnpay",
      customerInfo: {
        name: finalFormValues.name.trim(),
        phone: finalFormValues.phone.trim(),
        address: finalFormValues.address.trim(),
      },
      // Lưu toàn bộ orderData để sử dụng sau khi thanh toán thành công
      orderData: orderData
    };

    // Lưu vào sessionStorage trước khi redirect đến VNPay
    sessionStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));
    console.log("Pending order saved to sessionStorage before VNPay redirect");

    // Gửi đến VNPay - KHÔNG tạo đơn hàng trong database
    const vnpayResponse = await submitOrderToVNPay(total, vnpayOrderInfo);

    if (vnpayResponse && vnpayResponse.success && vnpayResponse.paymentUrl) {
      message.success("Đang chuyển hướng đến VNPay...");
      // Chuyển hướng đến VNPay
      window.location.href = vnpayResponse.paymentUrl;
    } else {
      console.error("VNPay response invalid:", vnpayResponse);
      throw new Error(
        "Không thể tạo link thanh toán VNPay: " +
          (vnpayResponse?.error || "Lỗi không xác định")
      );
    }
  } catch (vnpayError) {
    console.error("VNPay error:", vnpayError);
    message.error("Có lỗi xảy ra với VNPay: " + vnpayError.message);
  }
}
  } catch (error) {
    console.error("Checkout error:", error);

    let errorMessage = "Có lỗi xảy ra khi đặt hàng: ";

    if (error.response?.data?.message) {
      errorMessage += error.response.data.message;
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += "Lỗi không xác định. Vui lòng thử lại.";
    }

    message.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  // Fix nextStep để validate formData thay vì form values
  const nextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep === 0) {
      // Validate formData state
      const missingFields = [];
      if (!formData.name || formData.name.trim() === "")
        missingFields.push("Họ tên");
      if (!formData.phone || formData.phone.trim() === "")
        missingFields.push("Số điện thoại");
      if (!formData.address || formData.address.trim() === "")
        missingFields.push("Địa chỉ");

      if (missingFields.length > 0) {
        message.error(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}`);
        return;
      }

      // Validate phone format
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        message.error(
          "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số."
        );
        return;
      }

      console.log("Step 0 validation passed, moving to step 1");
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 1) {
      console.log("Moving from step 1 to step 2");
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Moving back from step", currentStep, "to", currentStep - 1);
    setCurrentStep(currentStep - 1);
  };

  // Debug current step
  console.log("Current step:", currentStep);
  console.log("Form values:", form.getFieldsValue());
  console.log("FormData state:", formData);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="shadow-lg border-0">
            <Title level={4} className="text-gray-800 mb-6 flex items-center">
              <UserOutlined className="mr-2 text-blue-600" />
              Thông tin giao hàng
            </Title>

            {/* User Info Display */}
            {currentUser && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Text className="text-sm text-blue-700">
                  Thông tin dưới đây được lấy từ tài khoản của bạn. Bạn có thể
                  chỉnh sửa nếu cần.
                </Text>
              </div>
            )}

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên!" },
                    { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Họ và tên"
                    className="rounded-lg"
                    value={formData.name}
                    onChange={(e) => {
                      console.log("Name field changed:", e.target.value);
                      handleFieldChange("name", e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Số điện thoại"
                    className="rounded-lg"
                    value={formData.phone}
                    onChange={(e) => {
                      console.log("Phone field changed:", e.target.value);
                      handleFieldChange("phone", e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="Địa chỉ giao hàng"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea
                size="large"
                placeholder="Địa chỉ giao hàng chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                rows={3}
                className="rounded-lg"
                value={formData.address}
                onChange={(e) => {
                  console.log("Address field changed:", e.target.value);
                  handleFieldChange("address", e.target.value);
                }}
              />
            </Form.Item>
          </Card>
        );

      case 1:
        return (
          <Card className="shadow-lg border-0">
            <Title level={4} className="text-gray-800 mb-6 flex items-center">
              <CreditCardOutlined className="mr-2 text-blue-600" />
              Phương thức thanh toán
            </Title>

            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <div className="space-y-4">
                {/* VNPay Option */}
                <div
                  className={`border-2 rounded-xl p-4 transition-colors ${
                    paymentMethod === "vnpay"
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <Radio value="vnpay" className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                          <CreditCardOutlined className="text-white text-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            VNPay
                          </div>
                          <div className="text-sm text-gray-500">
                            Thanh toán qua VNPay - An toàn & Nhanh chóng
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                          Khuyến nghị
                        </div>
                      </div>
                    </div>
                  </Radio>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  className={`border-2 rounded-xl p-4 transition-colors ${
                    paymentMethod === "cod"
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                >
                  <Radio value="cod">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                        <DollarOutlined className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Thanh toán khi nhận hàng (COD)
                        </div>
                        <div className="text-sm text-gray-500">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </div>
                      </div>
                    </div>
                  </Radio>
                </div>
              </div>
            </Radio.Group>

            {paymentMethod === "vnpay" && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <SafetyCertificateOutlined className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <div className="font-medium text-blue-800 mb-2">
                      Thanh toán VNPay
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Hỗ trợ thanh toán qua thẻ ATM nội địa</li>
                      <li>• Hỗ trợ thanh toán qua Visa, MasterCard</li>
                      <li>• Hỗ trợ thanh toán qua ví điện tử</li>
                      <li>• Bảo mật SSL 256-bit</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start">
                  <DollarOutlined className="text-green-600 mt-1 mr-3" />
                  <div>
                    <div className="font-medium text-green-800 mb-2">
                      Thanh toán khi nhận hàng
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Thanh toán bằng tiền mặt khi nhận hàng</li>
                      <li>• Được kiểm tra hàng trước khi thanh toán</li>
                      <li>• Phí ship: Miễn phí</li>
                      <li>• Hỗ trợ đổi trả trong 7 ngày</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );

      case 2:
        return (
          <Card className="shadow-lg border-0">
            <Title level={4} className="text-gray-800 mb-6 flex items-center">
              <CheckCircleOutlined className="mr-2 text-blue-600" />
              Xác nhận đơn hàng
            </Title>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <Title level={5} className="text-gray-800 mb-4">
                Thông tin giao hàng
              </Title>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Họ tên:</Text>
                  <Text strong>{formData.name || "Chưa nhập"}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Số điện thoại:</Text>
                  <Text strong>{formData.phone || "Chưa nhập"}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Địa chỉ:</Text>
                  <Text strong className="text-right max-w-xs">
                    {formData.address || "Chưa nhập"}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Phương thức thanh toán:</Text>
                  <Text strong>
                    {paymentMethod === "vnpay"
                      ? "VNPay"
                      : "Thanh toán khi nhận hàng (COD)"}
                  </Text>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-xl p-6">
              <Title level={5} className="text-gray-800 mb-4">
                Sản phẩm đặt hàng ({cartItems.length} sản phẩm)
              </Title>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                        onError={(e) => {
                          e.target.src = "/assets/images/products/default.jpg";
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {item.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Số lượng: {item.quantity} x{" "}
                          {item.product.price.toLocaleString("vi-VN")} VNĐ
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {(item.product.price * item.quantity).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VNĐ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  // Show loading screen while fetching user data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" tip="Đang tải thông tin thanh toán..." />
          </div>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <Title level={3} className="text-gray-600 mb-4">
              Vui lòng đăng nhập để tiếp tục thanh toán
            </Title>
            <Button type="primary" size="large" href="/auth">
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <Title level={3} className="text-gray-600 mb-4">
              Giỏ hàng trống
            </Title>
            <Text className="text-gray-500 mb-6">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
            </Text>
            <Button type="primary" size="large" href="/products">
              Mua sắm ngay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button>
          <Link to="/cart" className="hover:no-underline">
            <ShoppingCartOutlined className="mr-2" />
            Quay lại giỏ hàng
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Thanh toán
          </Title>
          <Text className="text-gray-600">
            Hoàn tất đơn hàng của bạn trong vài bước đơn giản
          </Text>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <Steps current={currentStep} items={steps} className="px-4" />
        </div>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              className="space-y-6"
              preserve={false}
            >
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  size="large"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-8 rounded-lg"
                  type="default"
                >
                  Quay lại
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={nextStep}
                    className="px-8 rounded-lg bg-blue-600 hover:bg-blue-700"
                  >
                    Tiếp tục
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    className="px-8 rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    {paymentMethod === "vnpay"
                      ? "Thanh toán VNPay"
                      : "Đặt hàng"}
                  </Button>
                )}
              </div>
            </Form>
          </Col>

          {/* Order Summary Sidebar */}
          <Col xs={24} lg={8}>
            <div className="sticky top-4">
              <Card className="shadow-lg border-0">
                <Title level={4} className="text-gray-800 mb-4">
                  Tóm tắt đơn hàng
                </Title>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <Text>Tạm tính:</Text>
                    <Text strong>{subtotal.toLocaleString("vi-VN")} VNĐ</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Phí vận chuyển:</Text>
                    <Text strong className="text-green-600">
                      {shippingFee === 0
                        ? "Miễn phí"
                        : `${shippingFee.toLocaleString("vi-VN")} VNĐ`}
                    </Text>
                  </div>
                  <Divider className="my-3" />
                  <div className="flex justify-between">
                    <Title level={5} className="mb-0">
                      Tổng cộng:
                    </Title>
                    <Title level={5} className="mb-0 text-red-600">
                      {total.toLocaleString("vi-VN")} VNĐ
                    </Title>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <SafetyCertificateOutlined className="text-blue-600 mr-2" />
                    <Text strong className="text-blue-800">
                      Cam kết bảo mật
                    </Text>
                  </div>
                  <Text className="text-sm text-blue-700">
                    Thông tin của bạn được bảo mật bằng công nghệ mã hóa SSL
                    256-bit
                  </Text>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutForm;
