import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { usegetAllCategories } from "../../03-features/admin/hook/01-Category/02-useGetAllCategory";
import { usegetAllSubCategory } from "../../03-features/admin/hook/02-subCatgory/02-usegetAllSubCategory";
import { useGetAllProducts } from "../../03-features/admin/hook/03-uploadProducts/02-useGetAllProducts";

import {
  setCategories,
  setSubCategories,
  setProducts,
  setLoading,
  setError,
} from "../../00-app/02-catalogSlice";
import { useNavigate } from "react-router-dom";
import { CategoryWiseProductDisplay } from "./CategoryWiseProductDisplay/01-CategoryWiseProductsDisplay";

export function Category() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, subCategories, products, isLoading, error } = useSelector(
    (state) => state.catalog
  );

  // React Query hooks
  const {
    data: AllCategories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = usegetAllCategories();
  const {
    data: AllSubCategories,
    isLoading: subCategoriesLoading,
    isError: subCategoriesError,
  } = usegetAllSubCategory();
  const {
    data: AllProducts,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetAllProducts();

  // Sync data with Redux
  useEffect(() => {
    // Set loading if any query is loading
    dispatch(
      setLoading(categoriesLoading || subCategoriesLoading || productsLoading)
    );

    if (AllCategories?.categories)
      dispatch(setCategories(AllCategories.categories));
    if (AllSubCategories?.categories)
      dispatch(setSubCategories(AllSubCategories.categories));
    if (AllProducts?.products) dispatch(setProducts(AllProducts.products));

    if (categoriesError || subCategoriesError || productsError) {
      dispatch(setError("Failed to fetch some data"));
    }
  }, [
    AllCategories,
    AllSubCategories,
    AllProducts,
    categoriesLoading,
    subCategoriesLoading,
    productsLoading,
    categoriesError,
    subCategoriesError,
    productsError,
    dispatch,
  ]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  function slugify(str = "") {
    return str
      .replaceAll(", ", "-")
       
      .replaceAll(" ", "-")
      .toLowerCase(); // optional: lowercase for cleaner URLs
  }

  function handleRedirectProductListPage(id, categoryName) {
     

    // Returns the first element that matches. If no match → returns undefined.
    const subCategory = subCategories?.find((sub) => sub.categoryId === id);

    // we are doing this for defult products

    const url = `/products/${slugify(categoryName)}-${id}/${slugify(
      subCategory.name
    )}-${subCategory.id}`;
    navigate(url);
  }

  return (
    <section>

       <div className="text-center mb-10 font-normal mt-25">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Shop by Category</h2>
        <p className="text-muted-foreground text-lg">Browse through our wide selection of products</p>
      </div>



      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 justify-items-center gap-2 md:gap-5 w-full px-3 py-3 md:px-8 lg:px-4  ">
        {isLoading
          ? Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-[8vw] h-[18vh]   rounded-md space-y-4 border border-gray-300  p-2"
              >
                <div className="w-full h-[10vh] bg-gray-200 animate-pulse rounded-md"></div>

                <div className="w-full h-[4vh]  bg-gray-200 animate-pulse"></div>
              </div>
            ))
          : categories?.map((cat, i) => (
              <div
                key={i}
                onClick={() => handleRedirectProductListPage(cat.id, cat.name)}
                className="cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt="category"
                  className="w-[30vw] h-[25vh] rounded-2xl  transition-all duration-300 
      hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                />
              </div>
            ))}
      </div>

      <div className="px-3 py-3  md:px-8 lg:px-4 ">
        {categories.slice(0, 5).map((cat, i) => (
          <div key={i} className="my-20">
            <CategoryWiseProductDisplay
              categoryId={cat.id}
              categoryName={cat.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
}


/*

Unit

Stock

Price

Discount

Description / More Description (detailed info about the product)

Shelf Life

Manufacturer Details (10 words only)

Marketed By

Country of Origin

Return Policy (20 words only)

Seller

*/