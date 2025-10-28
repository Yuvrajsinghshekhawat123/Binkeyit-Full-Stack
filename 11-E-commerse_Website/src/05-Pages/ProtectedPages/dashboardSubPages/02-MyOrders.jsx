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

export function Myorders() {
  const { data: orders, isLoading, isError, error } = useGetAllOrdersDetails();

  // Function to get status color and icon
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

  // Format date
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
          <div className="space-y-6">
            {orders.orders.map((order) => {
              const StatusIcon = getStatusInfo(order.delivery_status).icon;
              const statusColor = getStatusInfo(order.delivery_status).color;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md scroll-smooth "
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <FaBox className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-lg  font-semibold text-gray-900">
                            Order #{order.orderId}
                          </h2>
                          <div className="flex items-center gap-4 mt-1 flex-wrap">
                             
                            {/* 🟢 Payment Status */}
                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                order.payment_status === "Completed"
                                  ? "text-green-600 bg-green-50"
                                  : "text-red-600 bg-red-50"
                              }`}
                            >
                              <FaCreditCard className="w-4 h-4" />
                              {order.payment_status === "Completed"
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

                  {/* Products Grid */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Items
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {order.product_details.map((item, i) => (
                        <div
                          key={i}
                          className="border-2 border-gray-100 rounded-xl p-4 transition-all duration-300 hover:border-blue-200 hover:shadow-sm group"
                        >
                          <div className="aspect-square mb-3 bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                            <img
                              src={item.Image}
                              alt={item.Name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="font-medium text-gray-900 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item.Name}
                          </p>
                          {item.Quantity && (
                            <p className="text-sm text-gray-500 text-center mt-2">
                              Qty: {item.Quantity}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Track Order
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders. Start shopping to see your orders
                here.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
