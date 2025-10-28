import { ClipLoader } from "react-spinners";
import { useGetAllProducts } from "../../../hook/03-uploadProducts/02-useGetAllProducts";
import nothing_here_yet from "../../../assets/nothing_here_yet.webp";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { MoreDetails } from "./07-moreDetails";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { useDeleteProductById } from "../../../hook/03-uploadProducts/03-useDeleteProductById";
import { EditProductModel } from "../fromForEditProducts/01-editProductModel";
import Swal from "sweetalert2";

export function ShowAllProducts() {
  const [productId, setProductId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [ParentcategoryName, setParentCategoryName] = useState(
    "-- Select Parent Category --"
  );
  const [selectedSubCategoryId, setselectedSubCategoryId] = useState(null);
  const [CategoryId, setCategoryId] = useState(null);
  const [showEditProductModel, setShowEditProductsModel] = useState(false);
  const [Product, setProduct] = useState({
    name: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    moreDetails: "",
  });

  const [fields, setFields] = useState([]); // for add filed button
  const [images, setImages] = useState([]);

  const { data: AllProducts, isLoading } = useGetAllProducts();

  const [processingId, setProcessingId] = useState(null);

  const [expandedId, setExpandedId] = useState(null); // store product ids whose details are expanded

  const { mutate } = useDeleteProductById();
  const queryClient = useQueryClient();

  async function handleDeleteButton(id) {
    setProcessingId(id);

    mutate(id, {
      onSuccess: async (data) => {
        toast.success(data.message);
        await queryClient.invalidateQueries(["allProducts"]);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      },
      onSettled: () => {
        setProcessingId(null);
      },
    });
  }

  function toggleDetails(id) {
    setExpandedId(id);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
  }

  return (
    <section>
      <div>
        {AllProducts?.Products?.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <img
              src={nothing_here_yet}
              alt="no data"
              className="w-50 h-50 object-cover"
            />
            <p>No Products Found</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {AllProducts?.Products?.map((product) => {
              const isExpanded = expandedId === product.id;

              return (
                <li
                  key={product.id}
                  className="flex flex-col justify-between shadow-xl rounded-xl bg-white p-4"
                >
                  <div>
                    <div className="w-full flex justify-center">
                      {/* Product Image */}
                      {product.image.length > 0 && (
                        <img
                          src={product.image[0]?.url}
                          alt={product.name}
                          className="w-30 h-30 object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-4 w-full text-sm">
                      <p className="font-bold text-lg">
                        {product.name.length > 12
                          ? product.name.slice(0, 12) + "..."
                          : product.name}
                      </p>
                      <p>
                        <span className="font-semibold">Category:</span>{" "}
                        {product.CategoryName.length > 12
                          ? product.CategoryName.slice(0, 10) + "..."
                          : product.CategoryName}
                      </p>
                      <p>
                        <span className="font-semibold">SubCategory:</span>{" "}
                        {product.subCategoryName.length > 12
                          ? product.subCategoryName.slice(0, 10) + "..."
                          : product.subCategoryName}
                      </p>
                      <p>
                        <span className="font-semibold">Unit:</span>{" "}
                        {product.unit}
                      </p>
                      <p>
                        <span className="font-semibold">Stock:</span>{" "}
                        {product.stock}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> ₹
                        {product.price}
                      </p>
                      {product.discount >= 0 && (
                        <p className="text-green-600 font-medium">
                          Discount: {product.discount}%
                        </p>
                      )}

                      {/* More Details - toggled */}
                      {isExpanded && (
                        <>
                          <div
                            onClick={() => setExpandedId(null)}
                            className="fixed inset-0 bg-black/60 z-40"
                          ></div>

                          <MoreDetails
                            product={product}
                            onClose={setExpandedId}
                            onDelete={handleDeleteButton}
                            deletingId={processingId}
                            setDeletingId={setProcessingId}
                            isOpen={showEditProductModel}
                            setIsOpen={setShowEditProductsModel}
                            productId={productId}
                            setProductId={setProductId}
                            ParentcategoryName={ParentcategoryName}
                            setParentCategoryName={setParentCategoryName}
                            categoryId={CategoryId}
                            setCategoryId={setCategoryId}
                            subCategoryName={subCategoryName}
                            setSubCategoryName={setSubCategoryName}
                            selectedSubCategoryId={selectedSubCategoryId}
                            setselectedSubCategoryId={setselectedSubCategoryId}
                            Product={Product}
                            setProduct={setProduct}
                            fields={fields}
                            setFields={setFields}
                            images={images}
                            setImages={setImages}
                          />
                        </>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleDetails(product.id)}
                      className="mt-2 text-blue-500 hover:text-blue-800 text-sm font-medium underline cursor-pointer"
                    >
                      {!isExpanded && "More details..."}
                    </button>
                  </div>

                  <div className="p-2 border-t mt-4  flex justify-between">
                    <h1>
                      <MdOutlineModeEdit
                        className="inline text-2xl text-gray-500 hover:text-black hover:bg-green-400 cursor-pointer bg-green-200  w-8 h-8 p-1 rounded-full"
                        onClick={() => {
                          setProductId(product.id);
                          setParentCategoryName(product.CategoryName);
                          setCategoryId(product.categoryId);
                          setSubCategoryName(product.subCategoryName);
                          setselectedSubCategoryId(product.sub_categoryId);
                          setShowEditProductsModel(true);
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
                    {processingId === product.id ? (
                      <div className="flex justify-center items-center gap-4">
                        <ClipLoader
                          color="red"
                          className="inline"
                          loading
                          size={25}
                        />
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
                              setProcessingId(product.id); // start loading
                              handleDeleteButton(product.id); // call your delete logic
                            }
                          });
                        }}
                      >
                        <MdDeleteOutline className="inline text-2xl bg-red-200  w-8 h-8 p-1 rounded-full hover:text-black hover:bg-red-400 cursor-pointer" />
                      </h1>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* show edit button when clik on it  */}

        {showEditProductModel && (
          <div>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowEditProductsModel(false)}
            ></div>

            <EditProductModel
              setIsOpen={setShowEditProductsModel}
              productId={productId}
              ParentcategoryName={ParentcategoryName}
              setParentCategoryName={setParentCategoryName}
              categoryId={CategoryId}
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
      </div>
    </section>
  );
}
