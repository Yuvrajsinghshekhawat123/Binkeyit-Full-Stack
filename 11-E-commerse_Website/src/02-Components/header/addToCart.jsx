import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decreaseItem, increaseItem } from "../../00-app/03-cartSlice";
import { RiSubtractLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";

import { CiStopwatch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

export function CartSidebar({ setShowSideBar }) {
  const cartItems = useSelector((state) => state.cart.items) || {};
const userDetail = useSelector((state) => state.userDetail);
  const dispatch = useDispatch();
  console.log(cartItems);

  // Calculate totals
  const itemsTotal = Object.values(cartItems).reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const totalItems = Object.values(cartItems).reduce(
    (sum, item) => sum + item.count,
    0
  );

  const savedAmount = Object.values(cartItems).reduce(
    (sum, item) =>
      sum +
      (item.discount ? ((item.price * item.discount) / 100) * item.count : 0),
    0
  );

  const deliveryCharge = 25; // example
  const handlingCharge = 2;

  const grandTotal = itemsTotal - savedAmount + handlingCharge;

  if(totalItems <=0){
    setShowSideBar(false);
  }
  return (
    <div className="w-full max-w-sm bg-white p-4 shadow-[ -6px_0_15px_rgba(0,0,0,0.2) ]  rounded-lg font-normal max-h-[610px]  lg:max-h-[810px] xl:max-h-full 2xl:max-h-[870px] overflow-y-auto ">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-4">My Cart</h2>
        <div onClick={() => setShowSideBar((prev) => !prev)}>
          <RxCross2 className="inline font-bold text-2xl cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4 z-50">
        <div className="flex items-center h-[5vh] gap-2 my-4">
          <div className="h-15 w-15 flex justify-center items-center bg-gray-200 rounded-xl">
            <CiStopwatch className="inline text-black" size={30} />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold">Free delivery in 26 minutes</p>
            <p className="text-gray-600 font-normal text-sm">
              Shipment of {totalItems} items
            </p>
          </div>
        </div>

        {Object.entries(cartItems).map(([id, item]) => {
          const discountedPrice =
            item.discount > 0
              ? item.price - (item.price * item.discount) / 100
              : item.price;

          return (
            <div key={id} className="flex items-center gap-4 font-normal">
              <img
                src={item.image}
                alt=""
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {item.name?.length > 20
                    ? item.name.slice(0, 20) + "..."
                    : item.name}
                </p>
                <p className="text-sm text-gray-500">{item.unit}</p>
                <p className="text-sm font-semibold">
                  ₹{discountedPrice}
                  {item.discount > 0 && (
                    <span className="line-through text-gray-400 ml-1">
                      ₹{item.price}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-between items-center gap-3 min-w-[80px] px-2 font-semibold border border-green-700 bg-green-700 text-white py-2 rounded-lg text-sm lg:text-lg">
                <button
                  onClick={() => dispatch(decreaseItem(id))}
                  className="cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                >
                  <RiSubtractLine />
                </button>

                <span>{item.count}</span>

                <button
                  onClick={() => {
                    dispatch(increaseItem(id));
                  }}
                  className="cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                >
                  <IoMdAdd />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bill Details */}
      <div className="mt-6 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Items total</span>
          <span>
            <span className="text-gray-400 line-through">₹{itemsTotal}</span> ₹
            {itemsTotal - savedAmount}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery charge</span>
          <span>
            {" "}
            <span className="line-through text-gray-400">
              ₹{deliveryCharge}{" "}
            </span>
            FREE
          </span>
        </div>
        <div className="flex justify-between">
          <span>Handling charge</span>
          <span>₹{handlingCharge}</span>
        </div>
        <div className="flex justify-between font-bold mt-2 text-lg">
          <span>Grand total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold">Cancellation Policy</p>
        <p>
          Orders cannot be cancelled once packed for delivery. In case of
          unexpected delays, a refund will be provided, if applicable.
        </p>
      </div>

      {/* Prodcced to for payment  */}

      <div className="sticky -bottom-4 z-20 w-full max-w-3xl mx-auto bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-4 sm:p-6 my-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Link
          to={`${userDetail.userId?"/checkout":"/login"}`}
          className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0"
        >
          {/* Left Side: Grand Total Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
              Grand Total
            </h1>
            <span className="text-2xl sm:text-3xl font-bold mt-1 block">
              ₹{grandTotal}
            </span>
          </div>

          {/* Right Side: Proceed Button */}
          <button onClick={()=>setShowSideBar(false)} className=" bg-white text-green-700 font-semibold text-sm sm:text-base px-6 py-2 sm:py-3 rounded-full shadow-md hover:bg-green-50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
            {userDetail?.userId ? "Proceed" : "Login to Proceed"}
            <FaAngleRight />
          </button>
        </Link>
      </div>
    </div>
  );
}
