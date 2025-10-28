import { useEffect, useState } from "react";
import { UploadCategoryModel } from "../../../../03-features/admin/components/uploadCategoryModel/01-uploadCategory";
import { usegetAllCategories } from "../../../../03-features/admin/hook/01-Category/02-useGetAllCategory";
import { ClipLoader } from "react-spinners";
import nothing_here_yet from "../../../../03-features/admin/assets/nothing_here_yet.webp";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCategoryById } from "../../../../03-features/admin/hook/01-Category/03-usedeleteCategoryById";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export function Category() {
  const [showUploadCategoryModel, setShowUploadCategoryModel] = useState(false);
  const { data: AllCategories, isLoading, isError } = usegetAllCategories();

  const { mutate: deleteHandleButton } = useDeleteCategoryById();

  const [processingId, setProcessingId] = useState(null);
  const queryClient = useQueryClient();

  function handleDeleteButton(id) {
    setProcessingId(id);

    deleteHandleButton(id, {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(["allCategories"]);

        Swal.fire({
          icon: "success",
          title: data.message || "Deleted successfully",
          confirmButtonColor: "#16a34a",
        });
      },
      onError: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message || "Something went wrong!",
          confirmButtonColor: "#dc2626",
        });
      },
      onSettled: () => {
        setProcessingId(null);
      },
    });
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );

  if (isError) return <p>Failed to load categories</p>;

  return (
    <>
      <section>
        <section className="sticky  md:-top-8  flex justify-between items-center p-4 px-6 shadow-xl rounded-b-2xl h-[10vh] -mt-4 md:-mt-8 -mx-4 md:-mx-8 bg-white">
          <div>
            <h1 className="text-sm font-semibold md:text-xl md:font-bold text-gray-800">
              Category
            </h1>
          </div>

          <div className="">
            <button
              onClick={() => setShowUploadCategoryModel(true)}
              className="flex items-center gap-2  text-xs md:text-lg bg-blue-600 hover:bg-blue-700 text-white py-2 px-2  rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
              Add Category
            </button>
          </div>
        </section>

        {AllCategories?.categories?.length === 0 ? (
          <div className=" flex flex-col justify-center items-center h-[60vh]">
            <img
              src={nothing_here_yet}
              alt=""
              className="w-50 h-50 object-cover"
            />
            <p>No Data</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6  ">
            {AllCategories.categories.map((category, ind) => {
              return (
                <li
                  key={category.id}
                  className="flex flex-col items-center justify-center shadow-xl rounded-xl bg-white py-4"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-40 h-60  object-center pb-4"
                  />

                  <button
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "Cancel",
                        confirmButtonColor: "#dc2626", // Tailwind red-600
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDeleteButton(category.id); // Only call delete if confirmed
                        }
                      });
                    }}
                    className="text-center w-fit px-4 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processingId === category.id}
                  >
                    {processingId === category.id ? (
                      <div className="flex items-center gap-4">
                        <ClipLoader
                          color="white"
                          className="inline"
                          loading
                          size={22}
                        />{" "}
                        <span>deleting...</span>
                      </div>
                    ) : (
                      <span>delete</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* show upload category molde onyl when click on add category button  */}

        {showUploadCategoryModel && (
          <div>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowUploadCategoryModel(false)}
            ></div>

            <UploadCategoryModel setIsOpen={setShowUploadCategoryModel} />
          </div>
        )}
      </section>
    </>
  );
}
