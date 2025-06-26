import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Result,
  Button,
  Typography,
  Descriptions,
  Spin,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { createOrder } from "../../services/orders";
import { processCheckout } from "../../services/checkout"; // Thêm import này
import useCart from "../../hooks/useCart";

const { Title, Text } = Typography;

// Biến global ở ngoài component để đảm bảo không bị reset giữa các lần render
let isOrderCreationInProgress = false;
let globalOrderId = null;

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, clearEntireCart } = useCart();

  // Sử dụng useRef để theo dõi việc đã mount component hay chưa
  const mountedRef = useRef(false);
  // Ref để theo dõi việc đã xử lý đơn hàng chưa
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Đánh dấu component đã được mount
    mountedRef.current = true;

    // Cleanup function
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Chỉ chạy một lần, không quan tâm đến dependencies
    if (hasInitializedRef.current) {
      console.log("Already initialized, skipping");
      return;
    }

    // Đánh dấu đã khởi tạo
    hasInitializedRef.current = true;

    const initializeOrder = async () => {
      try {
        setLoading(true);
        console.log(
          "OrderSuccess: Initializing with search params:",
          Object.fromEntries(searchParams.entries())
        );
        console.log("OrderSuccess: Location state:", location.state);

        // ===== TRƯỜNG HỢP 1: Đơn hàng COD đã được tạo từ CheckoutForm =====
        if (
          location.state &&
          location.state.orderId &&
          location.state.paymentMethod === "cod"
        ) {
          console.log("COD order detected from state:", location.state);
          setOrderInfo(location.state);
          setLoading(false);
          return;
        }

        // ===== TRƯỜNG HỢP 2: Kiểm tra completedOrder trong sessionStorage =====
        const completedOrderStr = sessionStorage.getItem("completedOrder");
        if (completedOrderStr) {
          try {
            const completedOrder = JSON.parse(completedOrderStr);
            console.log(
              "Completed order found in sessionStorage:",
              completedOrder
            );
            setOrderInfo(completedOrder);

            // Đảm bảo giỏ hàng đã được xóa
            if (cartItems && cartItems.length > 0) {
              try {
                console.log("Clearing cart from completedOrder flow");
                await clearEntireCart();
                console.log("Cart cleared successfully");
              } catch (clearError) {
                console.error("Error clearing cart:", clearError);
              }
            }

            // Xóa dữ liệu sau khi sử dụng
            sessionStorage.removeItem("completedOrder");
            setLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing completed order:", error);
          }
        }

        // ===== TRƯỜNG HỢP 3: Xử lý direct redirect từ VNPay =====
        // Kiểm tra nếu đây là redirect trực tiếp từ VNPay (không qua callback)
        const isDirectVNPayRedirect =
          !location.state && window.location.pathname === "/order-success";

        if (isDirectVNPayRedirect) {
          console.log("Direct VNPay redirect detected");

          // Lấy thông tin đơn hàng từ pendingOrder
          const pendingOrderStr = sessionStorage.getItem("pendingOrder");
          if (!pendingOrderStr) {
            console.error("No pending order found");
            message.error("Không tìm thấy thông tin đơn hàng tạm thời");
            setLoading(false);
            return;
          }

          // Parse pendingOrder
          const pendingOrder = JSON.parse(pendingOrderStr);
          console.log(
            "Processing pending order from direct VNPay redirect:",
            pendingOrder
          );

          // Kiểm tra xem đơn hàng đã được tạo chưa
          if (pendingOrder.createdOrderId) {
            console.log(
              "Order already created with ID:",
              pendingOrder.createdOrderId
            );

            // Đơn hàng đã được tạo, chỉ cần hiển thị thông tin
            setOrderInfo({
              orderId: pendingOrder.createdOrderId,
              total: pendingOrder.amount,
              paymentMethod: "vnpay",
              transactionId: pendingOrder.transactionId || "UNKNOWN",
            });

            // Đảm bảo giỏ hàng đã được xóa
            if (cartItems && cartItems.length > 0) {
              try {
                console.log("Clearing cart from existing order flow");
                await clearEntireCart();
                console.log("Cart cleared successfully");
              } catch (clearError) {
                console.error("Error clearing cart:", clearError);
              }
            }

            setLoading(false);
            return;
          }

          // Đơn hàng chưa được tạo, tiến hành tạo mới
          if (pendingOrder.orderData) {
            // KIỂM TRA BIẾN GLOBAL để tránh gọi API hai lần
            if (isOrderCreationInProgress) {
              console.log("Order creation already in progress (global check)");

              // Nếu đã có orderId từ lần gọi trước (trong biến global)
              if (globalOrderId) {
                console.log(
                  "Using existing orderId from global variable:",
                  globalOrderId
                );

                const newOrderInfo = {
                  orderId: globalOrderId,
                  total: pendingOrder.amount || pendingOrder.orderData.total,
                  paymentMethod: "vnpay",
                  transactionId: pendingOrder.transactionId || "UNKNOWN",
                };

                setOrderInfo(newOrderInfo);
                setLoading(false);
              }

              return;
            }

            // Đặt flag để đảm bảo chỉ gọi API một lần - SỬ DỤNG BIẾN GLOBAL
            isOrderCreationInProgress = true;
            console.log("Setting isOrderCreationInProgress to TRUE");

            try {
              // Đặt trạng thái là confirmed vì đã thanh toán
              pendingOrder.orderData.status = "confirmed";
              pendingOrder.orderData.paymentMethod = "vnpay";

              // Tạo đơn hàng BẰNG API CHECKOUT thay vì createOrder
              console.log(
                "Creating order via checkout API after VNPay payment"
              );

              // Chuẩn bị dữ liệu cho API checkout
              const checkoutData = {
                paymentMethod: "vnpay",
                orderData: pendingOrder.orderData,
                vnpayData: {
                  vnp_ResponseCode: "00", // Mã thành công
                  vnp_TransactionNo: pendingOrder.transactionId || "UNKNOWN",
                  vnp_BankCode: pendingOrder.bankCode || "UNKNOWN",
                },
              };

              // Gọi API checkout thay vì createOrder
              const orderResponse = await processCheckout(checkoutData);
              console.log(
                "Order created successfully via checkout API:",
                orderResponse
              );

              // Xác định orderId từ response
              let orderId = null;
              if (orderResponse?.data?.orderId) {
                orderId = orderResponse.data.orderId;
              } else if (orderResponse?.orderId) {
                orderId = orderResponse.orderId;
              } else if (orderResponse?.id) {
                orderId = orderResponse.id;
              } else if (orderResponse?.data?.id) {
                orderId = orderResponse.data.id;
              }

              if (!orderId) {
                throw new Error("Không thể xác định mã đơn hàng từ response");
              }

              // Lưu orderId vào biến global để có thể sử dụng lại nếu cần
              globalOrderId = orderId;

              // Lưu thông tin đơn hàng đã tạo
              const newOrderInfo = {
                orderId: orderId,
                total: pendingOrder.amount || pendingOrder.orderData.total,
                paymentMethod: "vnpay",
                transactionId: pendingOrder.transactionId || "UNKNOWN",
              };

              // Cập nhật pendingOrder với orderId đã tạo để tránh tạo lại
              pendingOrder.createdOrderId = orderId;
              sessionStorage.setItem(
                "pendingOrder",
                JSON.stringify(pendingOrder)
              );

              // Lưu vào completedOrder để dùng lại nếu cần
              sessionStorage.setItem(
                "completedOrder",
                JSON.stringify(newOrderInfo)
              );

              // Xóa giỏ hàng
              if (cartItems && cartItems.length > 0) {
                try {
                  console.log(
                    "Clearing cart after successful order creation via checkout API"
                  );
                  await clearEntireCart();
                  console.log("Cart cleared successfully");
                } catch (clearError) {
                  console.error("Error clearing cart:", clearError);
                }
              }

              // Cập nhật UI
              if (mountedRef.current) {
                // Kiểm tra component còn mounted không
                setOrderInfo(newOrderInfo);
                message.success("Đơn hàng đã được tạo thành công!");
              }
            } catch (error) {
              console.error("Error creating order:", error);

              // Xử lý riêng cho lỗi "duplicate entry" hoặc "đơn hàng đã tồn tại"
              if (
                error.response?.data?.message?.includes("duplicate") ||
                error.message?.includes("đã tồn tại")
              ) {
                console.log(
                  "Duplicate order detected, attempting to retrieve existing order"
                );

                // Tìm kiếm orderId trong message lỗi
                const orderIdMatch =
                  error.response?.data?.message?.match(/#(\d+)/);
                const existingOrderId = orderIdMatch
                  ? orderIdMatch[1]
                  : "UNKNOWN";

                // Lưu orderId vào biến global để có thể sử dụng lại nếu cần
                globalOrderId = existingOrderId;

                console.log("Found existing order ID:", existingOrderId);
                const existingOrderInfo = {
                  orderId: existingOrderId,
                  total: pendingOrder.amount || pendingOrder.orderData.total,
                  paymentMethod: "vnpay",
                  transactionId: pendingOrder.transactionId || "UNKNOWN",
                };

                // Lưu thông tin đơn hàng đã tạo
                pendingOrder.createdOrderId = existingOrderId;
                sessionStorage.setItem(
                  "pendingOrder",
                  JSON.stringify(pendingOrder)
                );

                // Cập nhật UI
                if (mountedRef.current) {
                  // Kiểm tra component còn mounted không
                  setOrderInfo(existingOrderInfo);
                }

                // Vẫn xóa giỏ hàng
                if (cartItems && cartItems.length > 0) {
                  try {
                    console.log("Clearing cart from duplicate order flow");
                    await clearEntireCart();
                    console.log("Cart cleared successfully");
                  } catch (clearError) {
                    console.error("Error clearing cart:", clearError);
                  }
                }

                // Hiển thị thông báo
                if (mountedRef.current) {
                  // Kiểm tra component còn mounted không
                  message.warning("Đơn hàng này đã được tạo trước đó");
                }
              } else {
                if (mountedRef.current) {
                  // Kiểm tra component còn mounted không
                  message.error("Có lỗi khi tạo đơn hàng: " + error.message);
                }
              }
            } finally {
              // KHÔNG reset isOrderCreationInProgress để ngăn việc gọi API lại
              // Chúng ta sẽ giữ nó là true để mọi lần render sau đều không gọi API nữa
              console.log("Order creation process completed");
            }
          } else {
            console.error("No order data found in pending order");
            if (mountedRef.current) {
              // Kiểm tra component còn mounted không
              message.error("Không tìm thấy dữ liệu đơn hàng");
            }
          }
        } else {
          // Không phải từ VNPay và không có state
          console.log("No valid order information found");
          // Không chuyển hướng, hiển thị UI không tìm thấy đơn hàng
        }
      } catch (error) {
        console.error("Error in order initialization:", error);
        if (mountedRef.current) {
          // Kiểm tra component còn mounted không
          message.error("Có lỗi xảy ra: " + error.message);
        }
      } finally {
        if (mountedRef.current) {
          // Kiểm tra component còn mounted không
          setLoading(false);
        }
      }
    };

    initializeOrder();
  }, []); // Empty dependency array - chỉ chạy một lần khi component mount

  // Xóa giỏ hàng lại một lần nữa nếu vẫn còn items trong giỏ hàng
  useEffect(() => {
    if (orderInfo && cartItems && cartItems.length > 0) {
      console.log("Final attempt to clear cart if needed");
      const timer = setTimeout(async () => {
        if (!mountedRef.current) return; // Kiểm tra component còn mounted không

        try {
          await clearEntireCart();
          console.log("Cart cleared in final attempt");
        } catch (error) {
          console.error("Error in final cart clearing:", error);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [orderInfo, cartItems, clearEntireCart]);

  // Các hàm xử lý sự kiện - giữ nguyên
  const handleViewOrders = () => {
    navigate("/profile/orders");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Title level={4}>Đang hoàn tất đơn hàng của bạn...</Title>
            <Text type="secondary">Vui lòng đợi trong giây lát</Text>
          </div>
        </Card>
      </div>
    );
  }

  // Hiển thị không tìm thấy đơn hàng
  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Result
            status="info"
            title="Không tìm thấy thông tin đơn hàng"
            subTitle="Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ."
            extra={[
              <Button type="primary" key="home" onClick={handleBackToHome}>
                Về trang chủ
              </Button>,
              <Button key="shopping" onClick={handleContinueShopping}>
                Tiếp tục mua sắm
              </Button>,
              <Button key="orders" onClick={handleViewOrders}>
                Xem đơn hàng
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng (COD)",
      vnpay: "VNPay",
      banking: "Chuyển khoản ngân hàng",
    };
    return methods[method] || method;
  };

  // Hiển thị thông tin đơn hàng thành công
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800">
            Đặt hàng thành công!
          </Title>
        </div>

        <Card className="shadow-lg border-0">
          <Result
            status="success"
            title="Đơn hàng đã được đặt thành công!"
            subTitle={`Mã đơn hàng: #${orderInfo.orderId}. Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.`}
            extra={[
              <Button
                type="primary"
                key="orders"
                icon={<HistoryOutlined />}
                onClick={handleViewOrders}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Xem đơn hàng của tôi
              </Button>,
              <Button
                key="shopping"
                icon={<ShoppingOutlined />}
                onClick={handleContinueShopping}
              >
                Tiếp tục mua sắm
              </Button>,
            ]}
          >
            {/* Order Details */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <Title level={4} className="text-gray-800 mb-4">
                Chi tiết đơn hàng
              </Title>

              <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="Mã đơn hàng" span={2}>
                  <Text code className="text-blue-600">
                    #{orderInfo.orderId}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <Text strong className="text-green-600">
                    {formatCurrency(orderInfo.total)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {getPaymentMethodText(orderInfo.paymentMethod)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian đặt hàng" span={2}>
                  {new Date().toLocaleString("vi-VN")}
                </Descriptions.Item>
                {orderInfo.transactionId &&
                  orderInfo.transactionId !== "UNKNOWN" && (
                    <Descriptions.Item label="Mã giao dịch VNPay" span={2}>
                      <Text code>{orderInfo.transactionId}</Text>
                    </Descriptions.Item>
                  )}
              </Descriptions>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <Title level={5} className="text-blue-800 mb-3">
                Các bước tiếp theo:
              </Title>

              <div className="space-y-2 text-sm text-blue-700">
                {orderInfo.paymentMethod === "cod" ? (
                  <>
                    <div>• Đơn hàng của bạn đang được xử lý</div>
                    <div>• Chúng tôi sẽ liên hệ xác nhận trong vòng 24h</div>
                    <div>• Bạn sẽ thanh toán khi nhận hàng</div>
                    <div>• Thời gian giao hàng: 2-5 ngày làm việc</div>
                  </>
                ) : (
                  <>
                    <div>• Thanh toán đã được xác nhận qua VNPay</div>
                    <div>
                      • Đơn hàng sẽ được xử lý và giao trong 1-3 ngày làm việc
                    </div>
                    <div>• Bạn sẽ nhận email xác nhận đơn hàng</div>
                    <div>
                      • Có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng
                      của tôi"
                    </div>
                  </>
                )}
              </div>
            </div>
          </Result>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;
