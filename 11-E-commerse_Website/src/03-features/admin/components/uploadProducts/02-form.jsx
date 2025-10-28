 import { useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

import ReactCrop from "react-image-crop";

import { FaBoxes, FaPercent, FaRupeeSign, FaUserAlt } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
 
import { usegetAllCategories } from "../../hook/01-Category/02-useGetAllCategory";
import { SearchOrSelect } from "./05-searchOrSelect";
import { AiFillProduct, AiOutlineNumber } from "react-icons/ai";
import { useAddProduct } from "../../hook/03-uploadProducts/01-useProducts";
import { usegetAllSubCategory } from "../../hook/02-subCatgory/02-usegetAllSubCategory";
import { AddFieldButton } from "./03-addFiledForProduct";
 


export function FromForUploadSubCategory({ setIsOpen ,subCategoryName, setSubCategoryName, ParentcategoryName,setParentCategoryName }) {
  
  
  
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]); // ✅ store all cropped results

  const inputRef = useRef(null);

  const { data: AllCategories, isLoading,} = usegetAllCategories();
 const { data:AllSubCategories, isSubLoading,} = usegetAllSubCategory();  

   
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

      const [product, setProduct] = useState({
      name: "",
      unit: "",
      stock: "",
      price: "",
      discount: "",
      description: "",
      moreDetails: "",
    });


    function updateField(e) {
        const {name,value}=e.target;
      setProduct((prev) => ({ ...prev, [name]: value }));
    }

  
   
 

  const { mutate } = useAddProduct();
  const [processing, setProcessing] = useState(false);
  const queryClient = useQueryClient();




  
  const [isShowParentCategory, setIsShowParentCategory] = useState(false);
  const [isShowParentSubCategory, setIsShowParentSubCategory] = useState(false);

  

      const [fields,setFields]=useState([]); // for add filed button 


  const [crop, setCrop] = useState({
    unit: "px",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspect: 1,
  });

  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  /*
Dynamic cropping area on window resize
1. When you resize the browser window (or when the parent container size changes), the <img> preview inside the crop box also changes its rendered width/height.
2. If you didn’t recalculate, the crop rectangle would stay in the old coordinates → which may no longer match the resized image dimensions.
3. So, this ensures the crop area always stays centered and proportional to the new image size.
*/

  useEffect(() => {
    const handleResize = () => {
      if (image && imgRef.current) {
        const { width, height } = imgRef.current;
        const size = Math.min(width, height) * 0.8;
        setCrop({
          unit: "px",
          x: (width - size) / 2,
          y: (height - size) / 2,
          width: size,
          height: size,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [image]);



  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload only image files (jpg, png, etc).");
      return;
    }

    setImage(URL.createObjectURL(file));

    if (e.target.files.length > 0) {
      setFileName(e.target.files[0]);
    }
  }

  function handleFileRemove() {
    setFileName(null);
    setImage(null);
    inputRef.current.value = "";
  }

  /*
  Triggered when the image finishes loading
    .onLoad={handleImageLoad} is attached to the <img>.
    . This ensures the code runs only after the image dimensions (width, height) are available.

  Uses a short delay (setTimeout)
    . Sometimes the image dimensions are not fully calculated at the exact onLoad moment (especially when wrapped inside ReactCrop).
    . The setTimeout(..., 100) gives ReactCrop a little time (100ms) to finish layout calculations before setting the crop.


With this, the crop is:
Centered

Proportional (square)

Big enough (60%) but not exceeding the image bounds
  
  */

  function handleImageLoad(e) {
    const { width, height } = e.currentTarget;

    setTimeout(() => {
      const size = Math.min(width, height) * 0.8;
      setCrop({
        unit: "px",
        x: (width - size) / 2,
        y: (height - size) / 2,
        width: size,
        height: size,
      });
    }, 100);
  }

  function handleCropChange(c) {
    let newCrop = { ...c };
    if (newCrop.width > 280) newCrop.width = 280;
    if (newCrop.height > 300) newCrop.height = 300;
    setCrop(newCrop);
  }






// Step 1: Add cropped image to list
function handleAddCropped() {
  if (!completedCrop || !imgRef.current) {
    toast.error("Please crop an image first.");
    return;
  }

  const canvas = document.createElement("canvas");
  const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
  const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

  canvas.width = completedCrop.width;
  canvas.height = completedCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    imgRef.current,
    completedCrop.x * scaleX,
    completedCrop.y * scaleY,
    completedCrop.width * scaleX,
    completedCrop.height * scaleY,
    0,
    0,
    completedCrop.width,
    completedCrop.height
  );

  canvas.toBlob((blob) => {
    if (!blob) {
      toast.error("Cropping failed");
      return;
    }
    const file = new File([blob], `cropped-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    setCroppedImages((prev) => [...prev, file]);
    setFileName(null);
    setImage(null);
    inputRef.current.value = "";
    setCompletedCrop(null);
    
  });
}

// Step 2: Final submit → send all images
function handleSubmit(e) {
  e.preventDefault();
  if (croppedImages.length === 0) {
    toast.error("Please add at least one cropped image.");
    return;
  }

  const formData = new FormData();
  formData.append("subCategoryName", subCategoryName);
  formData.append("ParentcategoryName", ParentcategoryName);
  formData.append("categoryId", selectedCategoryId);
  formData.append("SubcategoryId", selectedSubCategoryId);
  
  Object.entries(product).forEach(([key, value]) => {
    formData.append(key, value);
  });


  formData.append("fields", JSON.stringify(fields));



  croppedImages.forEach((file) => {
    formData.append("product_images", file);
  });


  setProcessing(true);
   mutate(formData, {
          onSuccess: async (data) => {
            toast.success(data.message, " ", data.categoryId);
            // toast.success(`${data.message} (ID: ${data.categoryId})`);

            await queryClient.invalidateQueries(["allSubCategories"]);
            await queryClient.invalidateQueries({ queryKey: ["userDetails"] });
            setFileName(null);
            setImage(null);
            setIsOpen(false);

            setSubCategoryName("");   // reset name
          setSelectedCategoryId(null); // reset category
          setParentCategoryName("");   // reset parent name





           setProduct({
          name: "",
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          moreDetails: "",
        });

          

          },
          onError: (err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
          },
          onSettled: () => {
            setProcessing(false); // always runs
          },
        });
}




 

  if (isLoading || isSubLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
 

  return (
    <>
      <form onSubmit={handleSubmit} className="my-6 flex flex-col gap-4 ">
        <div className="text-sm md:text-lg relative">
           Parent Category:  
          {/* Trigger */}
          <div
            onClick={() => {setIsShowParentCategory((prev) =>!prev); setIsShowParentSubCategory(false)}}
            className="flex justify-between items-center cursor-pointer bg-blue-50 w-full p-2 border-2 border-t-none border-gray-300 hover:border-blue-700 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600"
          >
            <p>{ParentcategoryName || "Select a category"} </p>
            <h1 className="flex items-center gap-1">
              {isShowParentCategory ? (
                <GoTriangleDown className="text-2xl" />
              ) : (
                <GoTriangleUp className="text-2xl" />
              )}
            </h1>
          </div>
          {/* Dropdown */}
              
          <div className={`absolute z-10 top-17 w-full max-h-50 overflow-auto border border-t-0  shadow-md mt-2 bg-white transition-all duration-500 ease-in-out transform origin-top  ${
              isShowParentCategory
                ? "opacity-100 translate-y-0 scale-y-100"
                : "opacity-0 -translate-y-4 scale-y-0"
            }`}> 
           <SearchOrSelect Data={AllCategories.categories}   setIsShowOptions={setIsShowParentCategory} setSelectId={setSelectedCategoryId} setSelectIdName={setParentCategoryName} />
           </div >
        </div>
        <div className="text-sm md:text-lg relative">
           Parent Sub-Category:  
          {/* Trigger */}
          <div
            onClick={() => {setIsShowParentSubCategory((prev) =>!prev); setIsShowParentCategory(false)}}
            className="flex justify-between items-center cursor-pointer bg-blue-50 w-full p-2 border-2 border-t-none border-gray-300 hover:border-blue-700 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600"
          >
            <p>{ subCategoryName || "Select a Subcategory"} </p>
            <h1 className="flex items-center gap-1">
              {isShowParentSubCategory ? (
                <GoTriangleDown className="text-2xl" />
              ) : (
                <GoTriangleUp className="text-2xl" />
              )}
            </h1>
          </div>
          {/* Dropdown */}
              
          <div className={`absolute z-10 top-17 w-full max-h-50 overflow-auto border border-t-0  shadow-md mt-2 bg-white transition-all duration-500 ease-in-out transform origin-top  ${
              isShowParentSubCategory
                ? "opacity-100 translate-y-0 scale-y-100"
                : "opacity-0 -translate-y-4 scale-y-0"
            }`}> 
           <SearchOrSelect Data={AllSubCategories.categories}   setIsShowOptions={setIsShowParentSubCategory} setSelectId={setSelectedSubCategoryId} setSelectIdName={setSubCategoryName} />
           </div >
        </div>

        <div className="relative w-full  text-sm md:text-lg">
          <label htmlFor="name">Product Name :</label>
          <input
            type="text"
            id="name"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
            name="name"
            value={product.name}
            onChange={updateField}
            placeholder="Enter Product name"
            required
          />
          <AiFillProduct  className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-2xl" />
        </div>


        <div className="relative w-full  text-sm md:text-lg">
          <label htmlFor="unit">Unit :</label>
          <input
            type="text"
            id="unit"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
            name="unit"
            value={product.unit}
            onChange={updateField}
            placeholder="Enter Units"
            required
          />
          < AiOutlineNumber className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-2xl" />
        </div>
        <div className="relative w-full  text-sm md:text-lg">
          <label htmlFor="stock">Stock :</label>
          <input
            type="text"
            id="stock"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
            name="stock"
            value={product.stock}
            onChange={updateField}
            placeholder="Enter Stock"
            required
          />
          < FaBoxes className="inline absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400" />
        </div>
        <div className="relative w-full  text-sm md:text-lg">
          <label htmlFor="price">Price :</label>
          <input
            type="text"
            id="price"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
            name="price"
            value={product.price}
            onChange={updateField}
            placeholder="Enter Price"
            required
          />
          < FaRupeeSign className="inline absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400" />
        </div>
        <div className="relative w-full  text-sm md:text-lg">
          <label htmlFor="discount">Discount :</label>
          <input
            type="text"
            id="discount"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
            name="discount"
            value={product.discount}
            onChange={updateField}
            placeholder="Enter discount"
            required
          />
          <FaPercent className="inline absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400" />
        </div>


            <div className="relative w-full text-sm md:text-lg">
              <label htmlFor="description">Description :</label>
              <textarea
                id="description"
                className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
                name="description"
                value={product.description}
                onChange={updateField}
                placeholder="Enter short product description"
                rows={4} // ✅ controls height
                required
              />
             
            </div>

            <div className="relative w-full text-sm md:text-lg ">
              <label htmlFor="more_details">More Details :</label>
                  <textarea
                  className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
                    id="moreDetails"
                    name="moreDetails"   // ✅ matches state key
                    value={product.moreDetails}
                    onChange={updateField}
                    placeholder="Enter full details / specs"
                    rows={6}
                  />
            
            </div>

        

        <div className="w-full flex flex-col items-center gap-3 my-6 h-20">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            id="fileUpload"
            name="category_image"
            ref={inputRef}
          />

          <label
            htmlFor="fileUpload"
            className="flex gap-2 px-2 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition "
          >
            <IoMdCloudUpload className="inline  text-lg md:text-2xl " />
            <p className="text-sm md:text-lg"> Choose file</p>
          </label>

          {fileName ? (
            <div className="flex items-center gap-2 bg-gray-100 px-3 rounded-lg shadow-sm w-fit ">
              <span className="text-gray-700 text-sm truncate max-w-[200px]">
                {fileName.name}
              </span>
              <button
                className="text-red-500 hover:text-red-700 cursor-pointer h-8"
                onClick={handleFileRemove}
              >
                <RxCross2 className="inline" size={25} />
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm ">No file chosen</span>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm md:text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-lg"
             disabled={
              processing ||
              !croppedImages ||
              !subCategoryName ||
              !selectedCategoryId ||
              !product.name.trim() ||
              !product.unit.trim() ||
              !product.stock.trim() ||
              !product.price.trim() ||
              !product.discount.trim() ||
              !product.description.trim()
            }

            title={
              !fileName ? "Please select the image" : "Uploading the image"
            }
          >
            {processing ? (
              <div className="flex items-center gap-4 ">
                <ClipLoader color="white" loading size={22} />{" "}
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </form>

      <div className="flex justify-center my-6 relative">
         {image && (
            <div className="flex flex-col items-center gap-4">
              {/* Cropper */}
              <div
                className="flex flex-col items-center  mx-auto   overflow-hidden border rounded-lg "
                style={{ maxHeight: "40vh",  width: "300px" }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={handleCropChange}
                  onComplete={(c) => setCompletedCrop(c)}
                  keepSelection
                  aspect={1}
                  minWidth={200}
                  className="w-full h-full"
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Preview"
                    onLoad={handleImageLoad}
                    className="w-full h-full object-contain rounded-lg"
                    style={{ maxHeight: "32vh" }}
                  />
                </ReactCrop>
              </div>

              {/* ✅ Add Cropped Button */}
              <button
                type="button"
                onClick={handleAddCropped}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Cropped Image
              </button>
            </div>
          )}

      </div>





              {/* ✅ Preview all cropped images */}
        {croppedImages.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {croppedImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Cropped ${idx}`}
                  className=" w-full max-h-40  object-contain rounded-lg  "
                />
                <button
                  type="button"
                  onClick={() =>
                    setCroppedImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="cursor-pointer absolute top-0 right-2 bg-red-500 text-white rounded-full px-2 "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}




        {/* show the add filed */}



              {/* Display added fields immediately on UI */}
       {/* Display added fields immediately on UI */}
{fields.length > 0 && (
  <div className="mt-4 flex flex-col gap-4">
    {fields.map((f, i) => (
      <div key={i} className="relative w-full text-sm md:text-lg">
        <label className="font-medium text-gray-700">{f.key}</label>
         
          <textarea
          className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-sm md:placeholder:text-lg"
          placeholder={f.value }
          value={f.value}
          onChange={(e) => {
            const updated = [...fields];
            updated[i].value = e.target.value;
            setFields(updated);
          }}
          rows={1}
        />
         
      </div>
    ))}
  </div>
)}


        {/* add filed button */}
        <AddFieldButton fields={fields} setFields={setFields} />

    </>
  );
}
