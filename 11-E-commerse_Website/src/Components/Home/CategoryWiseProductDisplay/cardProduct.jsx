import { BsStopwatchFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../../../index.css"; // <-- import your CSS here
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseItem,
  increaseItem,
} from "../../../00-app/03-cartSlice";
import { toast } from "react-toastify";

export function CardProduct({ products }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items); //Get all items from Redux once, and then extract each product’s count inside the map:
 
  function slugify(str = "") {
    return str
      .replaceAll(",", "-")
      .replaceAll("&", "-")
      .replaceAll(" ", "-")
      .toLowerCase(); // optional: lowercase for cleaner URLs
  }

  function handleRedirectSingleProductDetial(productName, productId) {
    const url = `/prn/${slugify(productName)}/prid/${productId}`;
    navigate(url);
  }

  return (
    <>
      <div
        className="flex  gap-5 w-full z-10 "
        style={{ width: "100%" }} // 👈 ensures each page occupies full visible width
      >
        {products.map((product, i) => {
          const count = cartItems[product.id]?.count || 0;

          const imageUrl = product?.image?.[0]?.url || "/placeholder.png";
          const price = product?.price || 0;
          const discount = product?.discount || 0;
          const discountedPrice =
            discount > 0 ? price - (price * discount) / 100 : price;

          return (
            <div
              onClick={() =>
                handleRedirectSingleProductDetial(product.name, product.id)
              }
              key={product.id || i}
              className="relative w-[60vw]  h-[45vh] xs:w-full   md:w-[25vw] md:h-[48vh] lg:w-[20vw]  lg:h-[44vh]  xl:w-[17vw] 2xl:w-[14vw] xl:h-auto  flex-shrink-0 font-normal space-y-2 border p-4 shadow-lg border-gray-200 rounded-xl flex flex-col justify-between cursor-pointer transition-all duration-300 
      hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md   ">
                  {discount}% OFF
                </div>
              )}

              <div className="space-y-1">
                <div className="relative">
                  <div className="flex justify-center ">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={`w-[30vw] h-[12vh] object-contain lg:object-center lg:w-[8vw] lg:h-[15vh]   my-4  ${
                        product.stock === 0 && "opacity-50"
                      }`}
                    />
                  </div>

                  {/* Out of Stock Label */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center ">
                      <span className="bg-gray-400 text-white text-sm font-semibold px-2 py-1 rounded shadow">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md w-fit">
                  <BsStopwatchFill className="text-green-600 text-sm lg:text-lg" />
                  <span className="font-semibold text-[10px] lg:text-xs">
                    16 MINS
                  </span>
                </div>

                <h2 className="text-sm lg:text-md xl:text-lg font-normal h-12  lg:my-4  mb-2">
                  {product.name.length > 30
                    ? product.name.slice(0, 30) + "..."
                    : product.name}
                </h2>
                <h2 className="text-xs lg:text-md xl:text-lg text-gray-500 -mt-2 xl:mt-0">
                  {product.unit.length > 10
                    ? product.unit.slice(0, 10) + "..."
                    : product.unit}
                </h2>
              </div>

              <div className="flex justify-between items-center xl:-mt-1  ">
                {discount > 0 ? (
                  <div className="text-xs lg:text-sm">
                    <h1>₹{discountedPrice}</h1>
                    <span className="text-gray-400 text-xs lg:text-sm line-through">
                      ₹{price}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold">₹{price}</p>
                )}

                {product.stock === 0 ? (
                  <div></div>
                ) : count === 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🧠 prevents redirect
                      dispatch(
                        addToCart({
                          productId: product.id,
                          name:product.name,
                          image: imageUrl,
                          unit: product.unit,
                          price: product.price,
                          discount:product.discount
                        })
                      );
                    }}
                    className="font-semibold border border-green-600 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm lg:text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-800"
                  >
                    ADD
                  </button>
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()} // 🧠 prevent redirect for entire counter box
                    className="flex justify-between items-center gap-3 min-w-[80px] px-2 font-semibold border border-green-700 bg-green-700 text-white py-2 rounded-lg text-sm lg:text-lg"
                  >
                    <button
                      onClick={() => dispatch(decreaseItem(product.id))}
                      className="cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                    >
                      <RiSubtractLine />
                    </button>

                    <span>{count}</span>

                    <button
                      onClick={() => {
                        if (count >= product.stock) {
                          toast.error("Cannot add more than available stock!");
                          return;
                        }
                        dispatch(increaseItem(product.id));
                      }}
                      className="cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
