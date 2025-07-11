import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";

const VNPayRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processVNPayRedirect = async () => {
      try {
        // Kiểm tra VNPay status
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const isSuccess = vnp_ResponseCode === "00";

        if (!isSuccess) {
          // Redirect đến trang lỗi nếu thanh toán thất bại
          navigate("/vnpay-callback", { replace: true });
          return;
        }

        // Lấy thông tin từ pendingOrder
        const pendingOrderStr = sessionStorage.getItem("pendingOrder");
        if (!pendingOrderStr) {
          navigate("/vnpay-callback", { replace: true });
          return;
        }

        const pendingOrder = JSON.parse(pendingOrderStr);

        if (pendingOrder?.orderData) {
          pendingOrder.transactionId = searchParams.get("vnp_TransactionNo");
          pendingOrder.bankCode = searchParams.get("vnp_BankCode");
          sessionStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));

          navigate("/order-success", {
            replace: true,
            state: {
              fromVNPayRedirect: true,
              paymentMethod: "vnpay",
              transactionId: searchParams.get("vnp_TransactionNo"),
            },
          });
        } else {
          navigate("/vnpay-callback", { replace: true });
        }
      } catch (error) {
        console.error("Error processing VNPay redirect:", error);
        navigate("/vnpay-callback", { replace: true });
      }
    };

    processVNPayRedirect();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" tip="Đang xử lý thanh toán..." />
    </div>
  );
};

export default VNPayRedirect;
