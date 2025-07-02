import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Result, Button, Spin, Typography, Descriptions } from "antd";
import {
  processVNPayPayment,
  validateVNPayResponse,
  parseVNPayAmount,
} from "../../services/vnpay";
import useCart from "../../hooks/useCart";

const { Title, Text } = Typography;

const VNPayCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const { clearEntireCart } = useCart();

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        setLoading(true);

        // Lấy tất cả parameters từ URL
        const params = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        console.log("VNPay callback parameters:", params);

        // Validate VNPay response
        const validation = validateVNPayResponse(params);
        console.log("VNPay response validation:", validation);

        // Lấy thông tin đơn hàng từ sessionStorage
        const pendingOrderStr = sessionStorage.getItem("pendingOrder");
        let pendingOrder = null;

        if (pendingOrderStr) {
          try {
            pendingOrder = JSON.parse(pendingOrderStr);
            setOrderInfo(pendingOrder);
          } catch (e) {
            console.error("Error parsing pending order:", e);
          }
        }

        // Xử lý payment callback
        const result = await processVNPayPayment(params);
        console.log("Payment processing result:", result);

        // Cập nhật kết quả thanh toán
        const paymentData = {
          ...result,
          orderId: pendingOrder?.tempOrderId || params.vnp_TxnRef,
          amount: parseVNPayAmount(params.vnp_Amount) || pendingOrder?.amount,
          transactionId: params.vnp_TransactionNo,
          bankCode: params.vnp_BankCode,
          responseCode: params.vnp_ResponseCode,
          transactionDate: params.vnp_PayDate,
        };

        setPaymentResult(paymentData);

        // Tạo đơn hàng nếu thanh toán thành công và có pendingOrder
        if (result.success && validation.isSuccess && pendingOrder?.orderData) {
          try {
            console.log("Payment successful, preparing order data");

            // Kiểm tra xem đơn hàng đã được tạo chưa
            if (pendingOrder.createdOrderId) {
              console.log(
                "Order already created with ID:",
                pendingOrder.createdOrderId
              );

              // Cập nhật paymentResult với orderId đã tạo
              paymentData.orderId = pendingOrder.createdOrderId;
              setPaymentResult({ ...paymentData });

              await clearEntireCart();
            } else {
              pendingOrder.transactionId = params.vnp_TransactionNo;
              pendingOrder.bankCode = params.vnp_BankCode;
              sessionStorage.setItem(
                "pendingOrder",
                JSON.stringify(pendingOrder)
              );
            }

            // Chuyển hướng đến trang thành công
            navigate("/order-success", {
              state: {
                fromVNPayCallback: true,
                paymentMethod: "vnpay",
                transactionId: params.vnp_TransactionNo,
              },
            });
          } catch (error) {
            console.error("Error processing payment:", error);
          }
        }
      } catch (error) {
        console.error("Error in payment callback:", error);
        setPaymentResult({
          success: false,
          transactionStatus: "error",
          message: "Có lỗi xảy ra khi xử lý thanh toán",
          error: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processPaymentCallback();
  }, [searchParams, clearEntireCart, navigate]);

  const handleBackToHome = () => {
    navigate("/", { replace: true });
  };

  const handleViewOrders = () => {
    navigate("/profile/orders", { replace: true });
  };

  const handleRetryPayment = () => {
    navigate("/cart", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Title level={4}>Đang xử lý thanh toán...</Title>
            <Text type="secondary">Vui lòng đợi trong giây lát</Text>
          </div>
        </Card>
      </div>
    );
  }

  const renderResult = () => {
    if (!paymentResult) {
      return (
        <Result
          status="error"
          title="Lỗi xử lý thanh toán"
          subTitle="Không thể xử lý thông tin thanh toán. Vui lòng liên hệ hỗ trợ."
          extra={[
            <Button type="primary" key="home" onClick={handleBackToHome}>
              Về trang chủ
            </Button>,
          ]}
        />
      );
    }

    if (
      paymentResult.success &&
      paymentResult.transactionStatus === "completed"
    ) {
      return (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Đơn hàng #${paymentResult.orderId} đã được thanh toán thành công qua VNPay.`}
          extra={[
            <Button type="primary" key="orders" onClick={handleViewOrders}>
              Xem đơn hàng
            </Button>,
            <Button key="home" onClick={handleBackToHome}>
              Về trang chủ
            </Button>,
          ]}
        >
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <Descriptions column={1} size="small">
              {paymentResult.orderId && (
                <Descriptions.Item label="Mã đơn hàng">
                  <Text code>#{paymentResult.orderId}</Text>
                </Descriptions.Item>
              )}
              {paymentResult.amount && (
                <Descriptions.Item label="Số tiền">
                  <Text strong className="text-green-600">
                    {paymentResult.amount.toLocaleString("vi-VN")} VNĐ
                  </Text>
                </Descriptions.Item>
              )}
              {paymentResult.transactionId && (
                <Descriptions.Item label="Mã giao dịch">
                  <Text code>{paymentResult.transactionId}</Text>
                </Descriptions.Item>
              )}
              {paymentResult.bankCode && (
                <Descriptions.Item label="Ngân hàng">
                  <Text>{paymentResult.bankCode}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        </Result>
      );
    }

    if (paymentResult.transactionStatus === "cancelled") {
      return (
        <Result
          status="warning"
          title="Thanh toán đã bị hủy"
          subTitle="Bạn đã hủy giao dịch thanh toán. Đơn hàng vẫn được giữ và bạn có thể thanh toán lại."
          extra={[
            <Button type="primary" key="retry" onClick={handleRetryPayment}>
              Thanh toán lại
            </Button>,
            <Button key="orders" onClick={handleViewOrders}>
              Xem đơn hàng
            </Button>,
            <Button key="home" onClick={handleBackToHome}>
              Về trang chủ
            </Button>,
          ]}
        />
      );
    }

    // Payment failed
    return (
      <Result
        status="error"
        title="Thanh toán thất bại"
        subTitle={
          paymentResult.message ||
          "Giao dịch thanh toán không thành công. Vui lòng thử lại."
        }
        extra={[
          <Button type="primary" key="retry" onClick={handleRetryPayment}>
            Thử lại
          </Button>,
          <Button key="orders" onClick={handleViewOrders}>
            Xem đơn hàng
          </Button>,
          <Button key="home" onClick={handleBackToHome}>
            Về trang chủ
          </Button>,
        ]}
      >
        {paymentResult.responseCode && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã lỗi">
                <Text code className="text-red-600">
                  {paymentResult.responseCode}
                </Text>
              </Descriptions.Item>
              {paymentResult.orderId && (
                <Descriptions.Item label="Mã đơn hàng">
                  <Text code>#{paymentResult.orderId}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Result>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800">
            Kết quả thanh toán VNPay
          </Title>
        </div>

        <Card className="shadow-lg border-0">{renderResult()}</Card>

        {/* Order Info Display */}
        {orderInfo && (
          <Card className="shadow-lg border-0 mt-6">
            <Title level={4} className="text-gray-800 mb-4">
              Thông tin đơn hàng
            </Title>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Mã đơn hàng">
                <Text code>#{orderInfo.orderId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <Text strong>
                  {orderInfo.amount?.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thông tin đơn hàng" span={2}>
                <Text>{orderInfo.orderInfo}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">
                <Text>
                  {new Date(orderInfo.timestamp).toLocaleString("vi-VN")}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VNPayCallback;
