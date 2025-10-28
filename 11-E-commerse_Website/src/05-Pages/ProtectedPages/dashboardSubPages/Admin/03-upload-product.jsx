import { useState } from "react";
import { UploadProductModel } from "../../../../03-features/admin/components/uploadProducts/01-uploadProductModle";
import { usegetAllSubCategory } from "../../../../03-features/admin/hook/02-subCatgory/02-usegetAllSubCategory";
import { ClipLoader } from "react-spinners";
import { ShowAllProducts } from "../../../../03-features/admin/components/uploadProducts/showAllProducts/06-showAllProducts";

export function UploadProduct() {
  const [showUploadProductModel, setShowUploadProductsModel] = useState(false);

  const { data: AllSubCategories, isLoading } = usegetAllSubCategory();

  const [subCategoryName, setSubCategoryName] = useState("");
  const [ParentcategoryName, setParentCategoryName] = useState(
    "-- Select Parent Category --"
  );
  const [heading, setHeading] = useState("Upload Product");

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );

  return (
    <>
      <section>
        <section className="sticky  md:-top-8  flex justify-between items-center p-4 px-6 shadow-xl rounded-b-2xl h-[10vh] -mt-4 md:-mt-8 -mx-4 md:-mx-8 bg-white">
          <div>
            <h1 className="text-sm font-semibold md:text-xl md:font-bold text-gray-800">
              Upload-Products
            </h1>
          </div>

          <div className="">
            <button
              onClick={() => setShowUploadProductsModel(true)}
              className="flex items-center gap-2  text-xs md:text-lg bg-blue-600 hover:bg-blue-700 text-white py-2 px-2  rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
              Add Puoduct
            </button>
          </div>
        </section>

        {/* show upload Product molde onyl when click on add category button  */}

        {showUploadProductModel && (
          <div>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowUploadProductsModel(false)}
            ></div>

            <UploadProductModel
              setIsOpen={setShowUploadProductsModel}
              subCategoryName={subCategoryName}
              setSubCategoryName={setSubCategoryName}
              ParentcategoryName={ParentcategoryName}
              setParentCategoryName={setParentCategoryName}
              heading={heading}
            />
          </div>
        )}

        <ShowAllProducts  />
      </section>
    </>
  );
}
