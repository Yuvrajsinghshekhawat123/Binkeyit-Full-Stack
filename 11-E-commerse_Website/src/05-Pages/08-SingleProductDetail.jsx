import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductByProductId } from "../03-features/admin/hook/03-uploadProducts/07-useGetProductByProductId";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { GoTriangleUp } from "react-icons/go";

export function SingleProductPage() {
  const { productName, productId } = useParams();
  const { mutate: getProductById } = useGetProductByProductId();
  const [productLoading, setProductLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [more_details, setMore_Details] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const containRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navigate = useNavigate();

  // 👉 Scroll Handlers
  function handleScrollRight() {
    containRef.current.scrollBy({
      left: containRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  function handleScrollLeft() {
    containRef.current.scrollBy({
      left: -containRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  // 👉 Update button visibility on scroll
  function updateScrollButtons() {
    const el = containRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  useEffect(() => {
    const el = containRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [product]);

  function fetchProductDetails() {
    const formData = new FormData();
    formData.append("id", productId);

    setProductLoading(true);
    getProductById(formData, {
      onSuccess: (data) => {
        setProduct(() => data.Product);
        setImage(data.Product.image?.[0]?.url);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      },
      onSettled: () => {
        setProductLoading(false);
      },
    });
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  function slugify(str = "") {
    return str.replaceAll(", ", "-").replaceAll(" ", "-").toLowerCase();
  }

  function handleRedirectProductListPage(
    categoryId,
    categoryName,
    subCategoryName,
    subCategoryId
  ) {
    const url = `/products/${slugify(categoryName)}-${categoryId}/${slugify(
      subCategoryName
    )}-${subCategoryId}`;
    navigate(url);
  }

  const sliderRef = useRef(); // for mobile image slider

  // 👇 Detect which image is currently visible when scrolling
  // 👇 Detect which image is currently visible when scrolling (mobile)
  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col lg:flex-row w-full mb-4 px-4 sm:px-8 lg:px-16 xl:px-20 gap-6 ">
        {/* ---------- LEFT SECTION ---------- */}
        <section className="w-full lg:w-1/2 border-b border-gray-200 lg:border-r py-6 lg:py-0">
          <div className="hidden md:flex justify-center items-center lg:h-[70vh]  ">
            <img
              src={image}
              alt="Product"
              className="w-full max-w-[90%] sm:max-w-[60%] h-auto lg:max-h-[80%] object-contain"
            />
          </div>

          {/* on small scress show the differnt image slider */}
          <div
            className="flex gap-4 w-full overflow-x-auto scroll-smooth no-scrollbar md:hidden mb-4"
            ref={sliderRef}
            onScroll={handleScroll}
          >
            {product.image?.map((mg, ind) => (
              <img
                key={ind}
                src={mg.url}
                alt="Product"
                className="w-full flex-shrink-0 h-[50vh] object-cover"
              />
            ))}
          </div>

          <div className="flex gap-2 justify-center md:hidden">
            {product.image?.map((_, ind) => (
              <button
                key={ind}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  ind === activeIndex ? "bg-black scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Thumbnails with Arrows */}
          <div className="flex justify-center   mt-4   ">
            <div className="relative ">
              <div
                className="hidden md:flex gap-3 max-w-[80vw] md:max-w-[41vw] lg:max-w-[25vw] overflow-x-auto p-2 scroll-smooth no-scrollbar   "
                ref={containRef}
              >
                {product.image?.map((mg, ind) => (
                  <img
                    key={ind}
                    src={mg.url}
                    onLoad={updateScrollButtons}
                    className={`w-20 h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedImageIndex === ind
                        ? "border-green-800 scale-105"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setImage(mg.url);
                      setSelectedImageIndex(ind);
                    }}
                  />
                ))}
              </div>

              {canScrollLeft && (
                <button
                  onClick={handleScrollLeft}
                  className="absolute top-1/2  -left-5 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 cursor-pointer hidden md:flex"
                >
                  <GrFormPrevious className="text-2xl" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={handleScrollRight}
                  className="absolute top-1/2  -right-5 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 cursor-pointer hidden md:flex"
                >
                  <GrFormNext className="text-2xl" />
                </button>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="font-semibold text-gray-600 text-base sm:text-lg space-y-5 mt-6 px-2 sm:px-4">
            <h1 className="font-bold text-xl text-black border-b border-gray-300 pb-2">
              Product Details
            </h1>

            <div>
              <h1 className="font-semibold text-gray-700">Unit</h1>
              <p className="font-light text-gray-800">{product.unit}</p>
            </div>

            {/* More Details (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                more_details
                  ? "max-h-[1200px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <h1 className="font-semibold text-gray-700">Description</h1>
                <p className="font-light text-gray-800">
                  {product.description}
                </p>
              </div>

              {product.more_details?.length > 0 && (
                <div className="mt-3">
                  <h1 className="font-semibold text-gray-700">More Details</h1>
                  <p className="font-light text-gray-800">
                    {product.more_details}
                  </p>
                </div>
              )}

              {Array.isArray(product.fields) && product.fields.length > 0 && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <h1 className="font-bold text-lg text-gray-800 mb-3">
                    Additional Information
                  </h1>
                  <div className="divide-y divide-gray-100">
                    {product.fields.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row py-2 hover:bg-gray-50 rounded-md transition"
                      >
                        {/* Left column: fixed width on medium+ screens */}
                        <span className="font-medium text-gray-600 sm:w-1/3 mb-1 sm:mb-0">
                          {item.key}
                        </span>
                        {/* Right column: takes remaining space and aligns text to right */}
                        <span className="text-gray-800 sm:flex-1 sm:text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h1
              onClick={() => setMore_Details(!more_details)}
              className="flex items-center gap-1 hover:text-green-800 text-green-600 font-medium text-sm sm:text-base cursor-pointer select-none"
            >
              {more_details ? (
                <>
                  View less details
                  <GoTriangleUp className="text-lg inline-block rotate-180" />
                </>
              ) : (
                <>
                  View more details
                  <GoTriangleUp className="text-lg inline-block" />
                </>
              )}
            </h1>
          </div>
        </section>

        {/* ---------- RIGHT SECTION ---------- */}
        <section className="w-full lg:w-1/2 border-b border-gray-200 pb-8 lg:pb-2">
          <div className="sticky top-[150px] max-h-[90vh] px-2 sm:px-4">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-1 font-normal mb-2">
              <Link to="/" className="hover:text-green-700">
                Home
              </Link>
              <span>/</span>
              <Link
                onClick={() =>
                  handleRedirectProductListPage(
                    product.categoryId,
                    product.CategoryName,
                    product.subCategoryName,
                    product.sub_categoryId
                  )
                }
                className="hover:text-green-700"
              >
                {product.subCategoryName}
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </div>

            <h1 className="font-bold text-black text-lg sm:text-xl md:text-2xl mb-4">
              {product.name}
            </h1>

            <ProductOfferSection product={product} />
          </div>
        </section>
      </section>

      
    </>
  );
}

/* ------------------------- Product Offer Section ------------------------- */
import minute_delivery from "../assets/minute_delivery.png";
import Best_Prices_Offers from "../assets/Best_Prices_Offers.png";
import Wide_Assortment from "../assets/Wide_Assortment.png";
import { RiSubtractLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseItem, increaseItem } from "../00-app/03-cartSlice";

function ProductOfferSection({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const count =   cartItems[product.id]?.count || 0;      

   
  return (
    <div className="font-normal text-gray-800 mt-6 ">
      {/* Price Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-gray-500 font-medium text-sm mb-1">
            {product.unit}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {product.stock > 0 && (
              <h2 className="text-2xl font-bold text-black">
                ₹{" "}
                {product.discount > 0
                  ? product.price - (product.price * product.discount) / 100
                  : product.price}
              </h2>
            )}

            {product.discount > 0 && product.stock > 0 && (
              <div className="flex items-center gap-2">
                <p className="text-gray-500 line-through text-lg">
                  ₹{product.price}
                </p>
                <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded font-semibold">
                  {product.discount}% OFF
                </span>
              </div>
            )}

            {product.stock == 0 && (
              <h2 className="  font-medium text-md mb-1 text-red-500">
                Out of Stock
              </h2>
            )}
          </div>

          {product.stock > 0 && (
            <p className="text-[12px] text-gray-500 mt-1">
              (Inclusive of all taxes)
            </p>
          )}
        </div>

        {product.stock === 0 ? (
          <div></div>
        ) : count === 0 && product.stock > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation(); // 🧠 prevents redirect
              dispatch(
                addToCart({
                  productId: product.id,
                  name:product.name,
                  image: product.image[0].url,
                  unit: product.unit,
                  price: product.price,
                  discount:product.discount
                })

              );
               
            }}
            className="font-semibold border border-green-600 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm lg:text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-800"
          >
            Add to cart   
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

            <span>{count }</span>

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

      {/* Why shop section */}
      <div className="mt-6 lg:mt-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-5 ">
          Why shop from blinkit?
        </h3>

        <div className="flex flex-col gap-6">
          {[
            {
              img: minute_delivery,
              title: "Superfast Delivery",
              desc: "Get your order delivered to your doorstep at the earliest from dark stores near you.",
            },
            {
              img: Best_Prices_Offers,
              title: "Best Prices & Offers",
              desc: "Best price destination with offers directly from the manufacturers.",
            },
            {
              img: Wide_Assortment,
              title: "Wide Assortment",
              desc: "Choose from 5000+ products across food, personal care, household & other categories.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start sm:items-center gap-3">
              <img
                src={item.img}
                alt=""
                className="w-14 h-14 sm:w-18 sm:h-18 rounded-full object-contain"
              />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
