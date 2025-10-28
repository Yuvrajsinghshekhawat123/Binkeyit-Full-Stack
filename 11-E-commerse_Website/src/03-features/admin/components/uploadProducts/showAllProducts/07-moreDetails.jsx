import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { EditProductModel } from "../fromForEditProducts/01-editProductModel";
import Swal from "sweetalert2";

export function MoreDetails({
  product,
  onClose,
  onDelete,
  deletingId,
  setDeletingId,
  isOpen,
  setIsOpen,
  productId,
  setProductId,
  ParentcategoryName,
  setParentCategoryName,
  categoryId,
  setCategoryId,
  subCategoryName,
  setSubCategoryName,
  selectedSubCategoryId,
  setselectedSubCategoryId,
  Product,
  setProduct,
  fields,
  setFields,
  images,
  setImages,
}) {
  return (
    <section className="fixed z-50 top-1/2 left-1/2 w-[90%] h-[60%] max-w-md lg:max-w-xl max-h-[700px] md:w-[100%] md:h-[90%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-lg shadow-xl overflow-auto flex flex-col  justify-between">
      {/* Close Button */}
      <button
        onClick={() => onClose(null)}
        className="absolute top-2 right-2 text-red-500 font-bold cursor-pointer"
      >
        <RxCross2 className="inline" size={25} />
      </button>

      {/* Product Image */}
      {product?.image?.length > 0 && (
        <div className="w-full flex justify-center">
          <img
            src={product.image[0]?.url}
            alt={product.name}
            className="w-40 h-40 object-cover rounded"
          />
        </div>
      )}

      {/* Product Info */}
      <div>
        <div className="mt-4 text-lg">
          <p className="font-bold text-lg">
            Product Name: <span className="font-normal">{product.name}</span>
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {product.CategoryName}
          </p>
          <p>
            <span className="font-semibold">SubCategory:</span>{" "}
            {product.subCategoryName}
          </p>
          <p>
            <span className="font-semibold">Unit:</span> {product.unit}
          </p>
          <p>
            <span className="font-semibold">Stock:</span> {product.stock}
          </p>
          <p>
            <span className="font-semibold">Price:</span> ₹{product.price}
          </p>
          {product.discount > 0 && (
            <p className="text-green-600 font-medium">
              Discount: {product.discount}%
            </p>
          )}

          {product.description && (
            <p className="   mt-4">
              {" "}
              <strong>Description:</strong>{" "}
              <span className="text-gray-700 font-normal">
                {product.description}
              </span>
            </p>
          )}
          {product.more_details && (
            <p className=" mb-4 ">
              {" "}
              <strong>More Details: </strong>{" "}
              <span className="text-gray-700 font-normal">
                {product.more_details}{" "}
              </span>
            </p>
          )}
          {product.fields.length > 0 && (
            <div className="mt-2">
              <p className="">
                {" "}
                <strong>Extra Details:</strong>
              </p>
              <ul className="list-disc ml-6">
                {product.fields.map((f, i) => (
                  <li key={i}>
                    <span className="font-semibold">{f.key}:</span> {f.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border border-r-0 border-gray-300 flex justify-between">
        <h1>
          <MdOutlineModeEdit
            className="inline text-2xl text-gray-500 hover:text-black hover:bg-green-400 cursor-pointer bg-green-200  w-8 h-8 p-1 rounded-full"
            onClick={() => {
              onClose(null);

              setProductId(product.id);
              setParentCategoryName(product.CategoryName);
              setCategoryId(product.categoryId);
              setSubCategoryName(product.subCategoryName);
              setselectedSubCategoryId(product.sub_categoryId);
              setIsOpen(true);
              setImages(product.image);

              setProduct({
                name: product.name,
                unit: product.unit,
                stock: product.stock,
                price: product.price,
                discount: product.discount,
                description: product.description,
                moreDetails: product.more_details,
              });

              setFields(product.fields);
            }}
          />
        </h1>

        {/* Delete Button */}

        {deletingId === product.id ? (
          <div className="flex justify-center items-center gap-4">
            <ClipLoader color="red" className="inline" loading size={25} />
          </div>
        ) : (
          <h1
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#dc2626", // red
              }).then((result) => {
                if (result.isConfirmed) {
                  setDeletingId(product.id); // start loading or mark as deleting
                  onDelete(product.id); // perform the deletion
                }
              });
            }}
          >
            <MdDeleteOutline className="inline text-2xl bg-red-200  w-8 h-8 p-1 rounded-full hover:text-black hover:bg-red-400 cursor-pointer" />
          </h1>
        )}
      </div>

      {/* show edit button when clik on it  */}

      {isOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          <EditProductModel
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
            product={Product}
            setProduct={setProduct}
            fields={fields}
            setFields={setFields}
            images={images}
          />
        </div>
      )}
    </section>
  );
}
