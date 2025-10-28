
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearCart } from "../00-app/03-cartSlice";
import { useLayoutEffect } from "react";
export default function OrderSuccess() {
  const location = useLocation();
  const { orderId, totalAmt, paymentMethod } = location.state || {};
  
  
 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-normal">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <FaCheckCircle className="text-green-600 text-6xl mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been received.
        </p>

        {orderId && (
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
        )}

        {totalAmt && (
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Total Amount:</span> ₹{totalAmt}
          </p>
        )}

        {paymentMethod && (
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Payment:</span> {paymentMethod}
          </p>
        )}

        <Link
          to="/orders"
          className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition font-medium"
        >
          View My Orders
        </Link>

        <Link
          to="/"
          className="block mt-3 text-green-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
