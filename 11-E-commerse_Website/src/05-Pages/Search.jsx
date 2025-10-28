import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsBySearchName } from "../03-features/admin/hook/03-uploadProducts/08-useGetProductsBySearchName";
import { SearchPageCardLoading } from "../Components/SearchPage/01-cardLoading";
import { useEffect, useState } from "react";
import { CardProductList } from "../Components/SearchPage/01-cardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";

 
export function SearchPage() {
  const { mutate } = useGetProductsBySearchName();

   const params = useLocation();
    const searchText = params.search.slice(3);


  const [products, setProducts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  function fetchProduct(isNewSearch = false) {
    if (!searchText) {
      setHasMore(false);
      return;
    }
    const formData = new FormData();
    formData.append("page", isNewSearch ? 1 : page);
    formData.append("limit", limit);

    setProcessing(true);
    mutate(
      { query: searchText, data: formData },
      {
        onSuccess: (data) => {
          if (data.Products.length === 0) {
            setHasMore(false); // no more data
            return;
          }
            // 🔥 If new search — replace old data; otherwise, append
        if (isNewSearch) {
          setProducts(data.Products);
            setPage(2)
        } else {
          setProducts((prev) => [...prev, ...data.Products]);
          setPage((prev) => prev + 1);
        }

          // if we got less than limit, that means this is the last page
          if (data.Products.length < limit) {
            setHasMore(false);
          } else {
            setPage((prev) => prev + 1);
          }

          setProcessing(false);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "Something went wrong");
        },
        onSettled: () => {
          setProcessing(false);
        },
      }
    );
  }



  //Goal: Update data (replace old data) on each fetch   ,  We’ll separate two use cases:
  // 1. When searchText changes → reset + fetch fresh products.
  // 2. When fetching next page (infinite scroll) → append new products.
  
  
  // React re-runs the useEffect whenever searchText changes, meaning you can detect if the search query in the URL changed.
  useEffect(() => {
  if (!searchText || searchText.trim() == "") {
     
     setProducts([]);
    setHasMore(false);
    return;
  }

  setPage(1);
  setHasMore(true);
  setProducts([]);
  fetchProduct(true);
}, [searchText]);



  return (
    <>
      <section className="flex flex-col items-center ">
        <section className="w-full xl:w-[80vw] font-normal p-2">
          {processing && products.length === 0 ? (
            <SearchPageCardLoading />
          ) : (
            <InfiniteScroll
              dataLength={products.length}
              next={fetchProduct}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center items-center py-4">
                  <ClipLoader color="#2563eb" loading size={50} />
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

              
            </InfiniteScroll>
          )}
        </section>
      </section>
    </>
  );
}
