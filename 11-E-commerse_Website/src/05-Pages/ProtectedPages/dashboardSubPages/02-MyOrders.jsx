import { ClipLoader } from "react-spinners";
import { useGetAllOrdersDetails } from "../../../03-features/order/hook/03-useGetAllOrdersDetails";
import { toast } from "react-toastify";

import {
  FaCalendar,
  FaCreditCard,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useFedexTrackOrder } from "../../../03-features/order/hook/04-useTrackOrder";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteOrderByProductId } from "../../../03-features/order/hook/05-useDeleteOrderByProductId";
import { useQueryClient } from "@tanstack/react-query";

export function Myorders() {
  const { data: orders, isLoading, isError, error,isFetching  } = useGetAllOrdersDetails();
  

  useEffect(() => {
  queryClient.invalidateQueries({ queryKey: ["allOrders"] });
}, []);


  const { mutate: track } = useFedexTrackOrder();
  const navigate = useNavigate(); // ⭐ FIX
  const [trackingKey, setTrackingKey] = useState(null);

  const [cancelProductId, setCancelProductId] = useState(null);
  const { mutate: deleteProduct } = useDeleteOrderByProductId();
  const queryClient = useQueryClient();

  async function handleDeleteOrderProductById(productId, orderId) {
    setCancelProductId(productId);
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("productId", productId);

    deleteProduct(formData, {
      onSuccess: async (data) => {
        toast.success(data.message);
        await queryClient.invalidateQueries({ queryKey: ["allOrders"] });
        setCancelProductId(null);
      },

      onError: (error) => {
        setCancelProductId(null);
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  }

  function handleFedextrackOrder(uniqueKey) {
    setTrackingKey(uniqueKey);

    const formData = new FormData();
    formData.append("awb", "231300687629630");

    track(formData, {
      onSuccess: (trackingDetails) => {
        setTrackingKey(null);
        navigate("/tracking-order", { state: { trackingDetails } });
      },
      onError: (err) => {
        setTrackingKey(null);
        toast.error("Tracking failed");
      },
    });
  }

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { color: "text-green-600 bg-green-50", icon: FaCheckCircle };
      case "shipped":
        return { color: "text-blue-600 bg-blue-50", icon: FaTruck };
      case "processing":
        return { color: "text-yellow-600 bg-yellow-50", icon: FaBox };
      case "cancelled":
        return { color: "text-red-600 bg-red-50", icon: FaTimesCircle };
      default:
        return { color: "text-gray-600 bg-gray-50", icon: FaBox };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <ClipLoader color="#2563eb" loading size={50} />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  
  
  // 2️⃣ Show spinner on REFRESH (invalidateQueries)
if (isFetching) {
  return (
    <div className="flex justify-center items-center min-h-96">
      <div className="text-center">
        <ClipLoader color="#2563eb" loading size={50} />
        <p className="mt-4 text-gray-600">Refreshing orders...</p>
      </div>
    </div>
  );
}




  if (isError) {
    toast.error(error?.message || "Something went wrong");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders?.orders?.length > 0 ? (
          <div className="space-y-8">
            {orders.orders.map((order) => {
              const StatusIcon = getStatusInfo(order.delivery_status).icon;
              const statusColor = getStatusInfo(order.delivery_status).color;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <FaBox className="w-6 h-6 text-blue-600" />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderId}
                          </h2>
                          <div className="flex items-center gap-4 mt-1 flex-wrap">
                            {/* Payment Status */}
                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                order.payment_status === "Completed" ||
                                order.payment_status === "Refunded"
                                  ? "text-green-600 bg-green-50"
                                  : "text-red-600 bg-red-50"
                              }`}
                            >
                              <FaCreditCard className="w-4 h-4" />

                              {order.payment_status === "Completed" ||
                              order.payment_status === "Refunded"
                                ? "Paid"
                                : "Unpaid"}
                            </div>

                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <FaCalendar className="w-4 h-4" />
                              {formatDate(order.createdAt || new Date())}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{order.totalAmt}
                        </p>
                        <div className="flex items-center gap-1 justify-end text-gray-600 text-sm mt-1">
                          <FaCreditCard className="w-4 h-4" />
                          {order.payment_method || "Payment"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EACH PRODUCT LIKE MEESHO */}
                  <div className="p-6 space-y-4">
                    {order.product_details.map((item, i) => {
                      const price = Number(item.Price);
                      const discount = Number(item.Discount);
                      const finalPrice = price - (price * discount) / 100;
                      return (
                        <div
                          key={i}
                          className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-28 h-28 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.Name}
                                className="object-contain w-full h-full"
                              />
                            </div>

                            {/* PRODUCT DETAILS */}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-lg">
                                {item.Name}
                              </p>

                              <p className="text-gray-500 mt-1">
                                Qty: {item.Quantity}
                              </p>

                              {/* CANCELLED BADGE */}
                              {item.isCancelled ? (
                                <>
                                  {/* CANCELLED BADGE */}
                                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
                                    <FaTimesCircle className="w-4 h-4" />
                                    Cancelled
                                  </div>

                                  {/* REFUND MESSAGE — ADD THIS */}
                                  {item.refundStatus!="Pending" &&  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-700 font-semibold">
                                      Refund initiated
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                      Amount will be credited within{" "}
                                      <span className="font-medium">
                                        7 working days
                                      </span>
                                      .
                                    </p>
                                  </div>

                                  }
                                </>
                              ) : (
                                <div
                                  className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                                >
                                  <StatusIcon className="w-4 h-4" />
                                  {order.delivery_status}
                                </div>
                              )}

                              {/* Refund Status */}
                              {item.isCancelled && item.refundStatus!="Pending" && (
                                <p className="mt-2 text-sm text-gray-600">
                                  Refund Status:{" "}
                                  <span className="font-medium">
                                    {item.refundStatus}
                                  </span>
                                </p>
                              )}

                              {/* PRICE */}
                              <p className="mt-3 text-xl font-semibold text-gray-900">
                                ₹{finalPrice.toFixed(2)}
                              </p>

                              {/* Buttons */}
                              {!item.isCancelled && (
                                <div className="flex gap-3 mt-4">
                                  <button
                                    onClick={() =>
                                      handleFedextrackOrder(
                                        `${order.orderId}-${i}`
                                      )
                                    }
                                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                                  >
                                    {trackingKey === `${order.orderId}-${i}` ? (
                                      <div className="flex justify-center items-center gap-2">
                                        <ClipLoader
                                          color="black"
                                          loading
                                          size={22}
                                        />
                                        <span>Tracking...</span>
                                      </div>
                                    ) : (
                                      "Track Order"
                                    )}
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteOrderProductById(
                                        item.ProductId,
                                        order.orderId
                                      )
                                    }
                                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                                  >
                                    {cancelProductId === item.ProductId ? (
                                      <div className="flex justify-center items-center gap-2">
                                        <ClipLoader color="white" size={18} />
                                        <span>Canceling...</span>
                                      </div>
                                    ) : (
                                      "Cancel Item"
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // No Orders
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders. Start shopping now!
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
