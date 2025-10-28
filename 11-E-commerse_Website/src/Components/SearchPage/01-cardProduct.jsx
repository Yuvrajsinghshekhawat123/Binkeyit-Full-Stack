import { BsStopwatchFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../../index.css"
export function CardProductList({ products }) {
  const navigate = useNavigate();

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
        className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-4 xl:grid-cols-5 place-items-center  gap-2 space-y-4 bg-white"
        style={{ width: "100%" }} // 👈 ensures each page occupies full visible width
      >
        {products.map((product, i) => {
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
              className="relative w-[48vw] h-[45vh]  md:w-[24vw] md:h-[50vh] lg:w-[23vw] lg:h-[44vh] xl:w-[15vw] xl:h-[42vh]  2xl:w-[15vw] 2xl:h-[45vh]  flex-shrink-0 font-normal space-y-2 border p-4 shadow-lg border-gray-200 rounded-xl flex flex-col justify-between cursor-pointer"
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
                      className={`w-[30vw] h-[12vh] object-contain lg:object-center lg:w-[8vw] lg:h-[15vh]   my-4  ${product.stock===0 && "opacity-50"}`}
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

                <h2 className="text-[12px] xs:text-14px lg:text-md xl:text-lg font-normal h-12  lg:my-4  mb-2">
                  {product.name.length > 30
                    ? product.name.slice(0, 30) + "..."
                    : product.name}
                </h2>
                <h2 className="text-xs lg:text-md xl:text-lg text-gray-500 -mt-2 xl:mt-9 2xl:m-0">
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

                  {
                  product.stock === 0 ?<div></div>:
                  <button className="font-semibold border bg-green-50 hover:bg-green-100 text-green-500 px-4 py-2 rounded-lg text-sm lg:text-lg">
                  ADD
                </button>
                }
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
