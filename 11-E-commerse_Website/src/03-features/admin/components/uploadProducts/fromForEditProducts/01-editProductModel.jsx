import { RxCross2 } from "react-icons/rx";
import { FromForEditProduct } from "./fromForEditProduct";

export function EditProductModel({
  setIsOpen,
  productId,
  ParentcategoryName,
  setParentCategoryName,
  categoryId,
  setCategoryId,
  subCategoryName,
  setSubCategoryName,
  selectedSubCategoryId,
  setselectedSubCategoryId,
   product,
  setProduct,
  fields,
  setFields,
  images,
}) {
  return (
    <>
      {/* // In EditAvatar component, update the container class: */}
      <div className="fixed z-50 top-1/2 left-1/2 w-[90%] h-[60%] max-w-md lg:max-w-xl max-h-[700px] md:w-[100%] md:h-[90%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-lg shadow-xl overflow-auto">
        <div className="flex justify-between cursor-pointer">
          <RxCross2
            className="inline font-bold"
            onClick={() => setIsOpen(false)}
            size={25}
          />

          <h1 className=" text-sm md:text-lg font-bold">Edit Product</h1>
          <h1></h1>
        </div>

        <FromForEditProduct
          setIsOpen={setIsOpen}
            productId={productId}
          ParentcategoryName={ParentcategoryName}
          setParentCategoryName={setParentCategoryName}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          subCategoryName={subCategoryName}
          setSubCategoryName={setSubCategoryName}
          selectedSubCategoryId={selectedSubCategoryId}
          setselectedSubCategoryId={setselectedSubCategoryId}
           product={product}
            setProduct={setProduct}
            fields={fields}
              setFields={setFields}
              images={images}
        />
      </div>
    </>
  );
}
