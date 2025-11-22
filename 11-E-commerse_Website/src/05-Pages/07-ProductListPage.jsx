import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductsByCategoryIdAndSubCategoryId } from "../03-features/admin/hook/03-uploadProducts/06-useGetProductsByCategoryIdAndSubCategoryId";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { CardProductList } from "../Components/02-ProductList/01-cardProduct";
import { ClipLoader } from "react-spinners";
import { useGetAllSubcategoryByCategoryId } from "../03-features/admin/hook/02-subCatgory/04-useGetAllSubcategoryByCategoryId";
import nothingYetHere from "../assets/nothing_here_yet.webp";
export function ProductListpage() {
  const { category, subcategory } = useParams();
  const catgId = category.replace(/[^0-9]+/, "");
  const subCatgId = subcategory.replace(/[^0-9]+/, "");

  let subCatName = subcategory
    .replace(/[^a-zA-Z\-&]/g, "")
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1, word.length) + " "
    );

  const [subCategoryName, setSubCategoryName] = useState(subCatName);
  const [categoryId, setCategoryId] = useState(catgId);
  const [subCategoryId, setSubCategoryId] = useState( parseInt(subCatgId));

  const navigate = useNavigate();

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

   

  const { mutate: getProducts } = useGetProductsByCategoryIdAndSubCategoryId();
  const { mutate: getsubCategories } = useGetAllSubcategoryByCategoryId();

  const [hasMore, setHasMore] = useState(true);

  function slugify(str = "") {
    return str
      .replaceAll(", ", "-")

      .replaceAll(" ", "-")
      .toLowerCase(); // optional: lowercase for cleaner URLs
  }

  function fetchProduct() {
 
    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("page", page);
    formData.append("limit", limit);

    setProductLoading(true);
    getProducts(formData, {
      onSuccess: (data) => {
        if (data.Products.length === 0) {
          setHasMore(false); // no more data
          return;
        }
        setProducts((prev) => [...prev, ...data.Products]);

        // if we got less than limit, that means this is the last page
        if (data.Products.length < limit) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }

        setProductLoading(false); // stop spinner even if no products
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      },
      onSettled: () => {
        setProductLoading(false); // always runs
      },
    });
  }

  function fetchSubCategory() {
    const formData = new FormData();
    formData.append("categoryId", categoryId);

    setSubCategoryLoading(true);
    getsubCategories(formData, {
      onSuccess: (data) => {
        setSubCategories(data.subCategories);
        setSubCategoryLoading(false);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      },
      onSettled: () => {
        setSubCategoryLoading(false); // always runs
      },
    });
  }

  useEffect(() => {
    if (categoryId) {
      fetchSubCategory();
    }
  }, [categoryId]);


  
  useEffect(() => {
  window.scrollTo(0, 0);
}, [categoryId]);








  useEffect(() => {
    if (categoryId && subCategoryId) {
      setPage(1);
      setHasMore(true);
      setProducts([]);
      fetchProduct();
    }
  }, [categoryId, subCategoryId]);

  return (
    <>
      <section className="flex justify-center w-full mb-20 ">
        <section className="w-[80vw]   bg-white shadow-2xl">
          {/* sub-categroy header name */}
          <section className="w-full h-[5vh]  border border-gray-200 font-semibold flex items-center px-4 text-sm ">
            Buy {subCategoryName}Online
          </section>

          <section className="flex ">
            {/* sub-category left side */}
            <section className="w-[25%] md:w-[15%] xl:w-[7%] h-[80vh]   border-r border-gray-200 overflow-auto scroll-smooth ">
              {subCategoryLoading ? (
                <div className="space-y-8 pb-8">
                  {" "}
                  {Array.from({ length: 10 }).map((_, ind) => {
                    return (
                      <div key={ind} className="h-20 p-2   animate-pulse">
                        <div className="flex flex-col w-full items-center my-2 ">
                          <div className="h-15 w-15 p-2 bg-gray-200 rounded-md"></div>
                        </div>
                        <p className=" h-3 w-18 bg-gray-200 rounded-md"></p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 pb-8 scroll-smooth my-4   ">
                  {subCategories.map((subcategory, ind) => (
                    <div
                      key={ind}
                      className={`flex flex-col items-center cursor-pointer  rounded-md w-full py-2 ${subCategoryId===subcategory.id? "border-r-5 border-green-600 bg-gray-50 shadow-md scale-[1.02] transition-all duration-200":"hover:bg-gray-100 transition-all duration-200"}`}
                      onClick={() => {
                        

                        /*setSubCategoryName, setCategoryId, and setSubCategoryId are asynchronous.
                      So when handleRedirectSubCategory() runs right after them, it still uses old values, not the newly set ones. */
                        const name = subcategory.name + " ";
                        const catId = subcategory.categoryId;
                        const subId = subcategory.id;

                        setSubCategoryName(name);
                        setCategoryId(catId);
                        setSubCategoryId(subId);

                        const url = `/products/${category}/${slugify(
                          name
                        )}${subId}`;
                        navigate(url);

                        // simulate small delay to show skeleton for 1 sec
                        
                      }}
                    >
                      <img
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="h-12 w-12 object-contain rounded-md"
                      />
                      <p className="text-[10px] md:text-xs font-medium text-center mt-1 text-gray-500">
                        {subcategory.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {}
            </section>

            {/* right side product */}
            <section
              className=" bg-white w-[80%] md:w-[85%] xl:w-[93%] h-[80vh] overflow-auto scroll-smooth p-4"
              id="scrollableDiv"
            >
              {(productLoading || subCategoryLoading) &&
              products.length == 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 place-items-center  gap-2 space-y-4 bg-white">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative w-[45vw] h-[45vh] md:w-[25vw] md:h-[45vh] lg:w-[20vw] xl:w-[15vw]   flex-shrink-0 font-normal space-y-2 border p-4 shadow-lg border-gray-200 rounded-xl flex flex-col justify-between   cursor-pointer animate-pulse"
                    >
                      {/* Image Placeholder */}
                      <div className="flex justify-center mb-3">
                        <div className="w-[40vw] sm:w-[28vw] md:w-[20vw] lg:w-[15vw] h-[20vh] bg-gray-200 rounded-lg" />
                      </div>

                      {/* Text Lines */}
                      <div className="space-y-2">
                        <div className="bg-gray-200 h-3 w-20 rounded-md"></div>
                        <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
                        <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
                      </div>

                      {/* Bottom Buttons/Price Skeleton */}
                      <div className="flex justify-between items-center mt-3">
                        <div className="bg-gray-200 h-4 w-1/4 rounded-md"></div>
                        <div className="bg-gray-200 h-8 w-16 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={products.length}
                  next={fetchProduct}
                  hasMore={hasMore}
                  loader={
                    <div className="flex justify-center items-center py-4">
                      <ClipLoader color="#2563eb" loading size={40} />
                    </div>
                  }
                  endMessage={
                    <p className="text-center py-4 text-gray-500 font-normal">
                      No more products
                    </p>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <CardProductList products={products} />

                  {
                    // if product lehth is zero mens no prouct
                  }
                  {products.length === 0 && (
                    <div className="w-full flex justify-center ">
                      <img src={nothingYetHere} alt="" className="w-[20vw] " />
                    </div>
                  )}
                </InfiniteScroll>
              )}

              {/* product list */}
            </section>

            {/*  for detilas  */}
          </section>
           
        </section>
      </section>
    </>
  );
}
