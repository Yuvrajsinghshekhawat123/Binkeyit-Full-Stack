import { useState } from "react";

import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { UploadSubCategoryModel } from "./01-uploadSub-CategoryModel";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteSubCategoryById } from "../../hook/02-subCatgory/03-useDeleteSubCategory";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

export function ShowAllSubCategory({ AllSubCategories, setIsOpen }) {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [ParentcategoryName, setParentCategoryName] = useState(
    "-- Select Parent Category --"
  );
  const [heading, setHeading] = useState("Edit Sub-category");

  const [selectedSubCategoryId, setselectedSubCategoryId] = useState(null);
  const [CategoryId, setCategoryId] = useState(null);
  const [isShowSelectedSubCategoryImage, setIsShowSelectedSubCategoryImage] =
    useState(false);
  const [isShowEditSubCategoryForm, setIsShowEditSubCategoryForm] =
    useState(false);

  // delete the sub category
  const { mutate: deleteHandleButton } = useDeleteSubCategoryById();

  const [processingId, setProcessingId] = useState(null);
  const queryClient = useQueryClient();

  function handleDeleteButton(id) {
    setProcessingId(id);
    deleteHandleButton(id, {
      onSuccess: async (data) => {
        toast.success(data.message);
        await queryClient.invalidateQueries(["allSubCategories"]);
      },
      onError: (err) => {
        toast.error(err.response.data.message || "something went wrong");
      },
      onSettled: () => {
        setProcessingId(null);
      },
    });
  }

  return (
    <>
      <div className="w-full overflow-auto scrollbar-thin border border-black my-4">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-[10%_34%_34%_10%_12%]  bg-black text-white font-bold text-center  ">
            <div className="p-2 border-r-2 border-white">Sr. No</div>
            <div className="p-2 border-r-2 border-white">Category</div>
            <div className="p-2 border-r-2 border-white">Sub-Category Name</div>
            <div className="p-2 border-r-2 border-white">Image</div>
            <div className="p-2 ">Action</div>
          </div>

          {/* Rows */}
          {AllSubCategories?.categories?.map((subCategory, ind) => {
            return (
              <div
                key={subCategory.id}
                className="grid grid-cols-[10%_34%_34%_10%_12%] text-center"
              >
                <div className="p-2 border border-gray-300 font-bold">
                  {ind + 1}
                </div>
                <div
                  className="p-2 border border-gray-300 max-h-[8vh] overflow-x-auto font-bold"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {subCategory.categoryName}
                </div>
                <div
                  className="p-2 border border-gray-300  max-h-[8vh] overflow-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {subCategory.name}
                </div>
                <div
                  onClick={() => {
                    setselectedSubCategoryId(subCategory.id);
                    setIsShowSelectedSubCategoryImage(true);
                  }}
                  className="p-2 border border-gray-300 flex justify-center cursor-pointer hover:bg-gray-200 bg-white"
                >
                  <img
                    src={subCategory.image}
                    alt="jfd"
                    className="w-[5vw] h-[5vh] object-contain "
                  />
                </div>
                <div className="p-2 border border-r-0 border-gray-300 flex justify-between">
                  <h1>
                    <MdOutlineModeEdit
                      className="inline text-2xl text-gray-500 hover:text-black hover:bg-green-400 cursor-pointer bg-green-200  w-8 h-8 p-1 rounded-full"
                      onClick={() => {
                        setselectedSubCategoryId(subCategory.id);
                        setSubCategoryName(subCategory.name);
                        setParentCategoryName(subCategory.categoryName);
                        setIsShowEditSubCategoryForm(true);
                        setCategoryId(subCategory.categoryId);
                      }}
                    />
                  </h1>

                  {selectedSubCategoryId === subCategory.id && processingId ? (
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
                          confirmButtonColor: "#dc2626",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setselectedSubCategoryId(subCategory.id); // set the selected sub-category first
                            handleDeleteButton(subCategory.id); // then call delete
                          }
                        });
                      }}
                    >
                      <MdDeleteOutline className="inline text-2xl bg-red-200  w-8 h-8 p-1 rounded-full hover:text-black hover:bg-red-400 cursor-pointer" />
                    </h1>
                  )}
                </div>

                {/* show select image  */}
                {selectedSubCategoryId === subCategory.id &&
                  isShowSelectedSubCategoryImage && (
                    <div className="fixed z-50 top-1/2 left-1/2 w-[90%] h-[60%] max-w-md max-h-[700px]  md:w-[80%] md:h-[60%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-lg shadow-xl overflow-auto">
                      <div className="flex justify-between  ">
                        <RxCross2
                          className="inline font-bold cursor-pointer"
                          onClick={() => {
                            setIsShowSelectedSubCategoryImage(false);
                            setIsShowEditSubCategoryForm(false);
                          }}
                          size={25}
                        />

                        <h1 className=" text-sm md:text-lg font-bold">
                          Sub-Categroy image
                        </h1>

                        <h1></h1>
                      </div>
                      <div className="w-full h-full my-4 flex justify-center">
                        <img
                          src={subCategory.image}
                          alt={subCategory.name}
                          className="w-[70%] h-[90%]"
                        />
                      </div>
                    </div>
                  )}

                {isShowEditSubCategoryForm &&
                  selectedSubCategoryId === subCategory.id && (
                    <UploadSubCategoryModel
                      setIsOpen={setIsShowEditSubCategoryForm}
                      subCategoryName={subCategoryName}
                      setSubCategoryName={setSubCategoryName}
                      ParentcategoryName={ParentcategoryName}
                      setParentCategoryName={setParentCategoryName}
                      heading={heading}
                      CategoryId={CategoryId}
                      selectedSubCategoryId={selectedSubCategoryId}
                    />
                  )}
              </div>
            );
          })}
        </div>
        {(isShowSelectedSubCategoryImage || isShowEditSubCategoryForm) && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => {
              setIsShowSelectedSubCategoryImage(false);
              setIsShowEditSubCategoryForm(false);
            }}
          ></div>
        )}
      </div>
    </>
  );
}
