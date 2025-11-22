import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useGetProductsByCategory } from "../../../03-features/admin/hook/03-uploadProducts/05-useGetProductsByCategory";
import { CardLoading } from "./cardLoading";
import { CardProduct } from "./cardProduct";
import { useSelector } from "react-redux";

export function CategoryWiseProductDisplay({ categoryId, categoryName }) {
  const { mutate } = useGetProductsByCategory();
  const [products, setProducts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containRef = useRef();

  // 👉 Scroll Handlers
  function handleScrollRight() {
    containRef.current.scrollBy({
      left: containRef.current.clientWidth - 80,
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
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  }

  // 👉 Attach scroll listener
  useEffect(() => {
    const el = containRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [products]);

  // 👉 Fetch products
  useEffect(() => {
    if (!categoryId) return;
    setProcessing(true);
    mutate(categoryId, {
      onSuccess: (res) => {
        setProducts(res?.Products || []);
        setProcessing(false);
      },
      onError: (err) => console.error(err.message),
    });
  }, [categoryId]);

  const { subCategories } = useSelector((state) => state.catalog);

  function slugify(str = "") {
    return str
      .replaceAll(", ", "-")

      .replaceAll(" ", "-")
      .toLowerCase(); // optional: lowercase for cleaner URLs
  }

  function handleRedirectProductListPage() {
    // Returns the first element that matches. If no match → returns undefined.
    const subCategory = subCategories?.find(
      (sub) => sub.categoryId === categoryId
    );

    // we are doing this for defult products

    const url = `/products/${slugify(categoryName)}-${categoryId}/${slugify(
      subCategory.name
    )}-${subCategory.id}`;
    navigate(url);
  }

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex justify-between my-2 mx-1 font-normal">
        <h1 className="font-semibold text-sm md:text-2xl">
          {categoryName} {categoryId}
        </h1>

        <Link
  onClick={() => handleRedirectProductListPage()}
  className="inline-flex items-center gap-1 px-4 py-2 
             text-sm md:text-base font-semibold
             text-green-800 bg-white 
             rounded-full border border-green-200 
             shadow hover:bg-green-50 hover:shadow-lg 
             hover:-translate-y-1 transition-all duration-200"
>
  See All
  <span className="text-lg">→</span>
</Link>

      </div>

      {/* Product carousel */}
      {processing && products.length === 0 ? (
        <div className="overflow-hidden">
          <CardLoading />
        </div>
      ) : (
        <div className="relative">
          <div
            ref={containRef}
            className="w-full overflow-x-auto lg:overflow-hidden scroll-smooth no-scrollbar "
          >
            <CardProduct products={products} />
          </div>

          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 cursor-pointer hidden lg:flex"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
            >
              <GrFormPrevious className="text-2xl" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={handleScrollRight}
              className="absolute top-1/2 -right-5 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 cursor-pointer hidden lg:flex"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
            >
              <GrFormNext className="text-2xl" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
