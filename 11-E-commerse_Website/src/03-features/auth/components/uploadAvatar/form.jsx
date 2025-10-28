 import {useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { useUploadAvatar } from "../../hook/useUploadAvatar";
import ReactCrop from "react-image-crop";

export function FromForUploadAvatar({ setIsOpen }) {
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  const { mutate: UploadAvatar } = useUploadAvatar();
  const [processing, setProcessing] = useState(false);
  const queryClient = useQueryClient();

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
        const size = Math.min(width, height) * 0.6;
        setCrop({
          unit: "px",
          x: (width - size) / 2,
          y: (height - size) / 2,
          width: size,
          height: size,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      const size = Math.min(width, height) * 0.6;
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
    if (newCrop.width > 300) newCrop.width = 300;
    if (newCrop.height > 300) newCrop.height = 300;
    setCrop(newCrop);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!completedCrop || !imgRef.current) {
      toast.error("Please crop the image before uploading.");
      return;
    }

    setProcessing(true);

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext("2d");
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
        toast.error("Crop failed. Try again.");
        setProcessing(false);
        return;
      }

      const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("avatar", croppedFile);

      UploadAvatar(formData, {
        onSuccess: async (data) => {
          toast.success(data.message);
          await queryClient.invalidateQueries({ queryKey: ["userDetails"] });
          setFileName(null);
          setImage(null);
          setIsOpen(false);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "Something went wrong");
        },
        onSettled: () => {
          setProcessing(false); // always runs
    
        },
      });
    }, "image/jpeg", 1);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col items-center gap-3 my-6 h-20 text-sm md:text-lg">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            id="fileUpload"
            name="avatar"
            ref={inputRef}
          />

          <label
            htmlFor="fileUpload"
            className="text-sm md:text-lg px-6 py-3 bg-indigo-600 text-white  font-medium rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition"
          >
            Choose file
          </label>

          {fileName ? (
            <div className="flex items-center gap-2 bg-gray-100 px-3 rounded-lg shadow-sm w-fit text-sm md:text-lg">
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
            <span className="text-gray-500 text-sm md:text-lg">No file chosen</span>
          )}
        </div>

        <div className="flex justify-end space-x-2 ">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm md:text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-sm md:text-lg px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={processing || !fileName} 
            title={!fileName ? "Please select the image" : "Uploading the image"}
          >
            {processing ? (
              <div className="flex items-center gap-4">
                <ClipLoader color="white" loading size={22} />{" "}
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </form>

      <div className="flex justify-center my-6"> 
        {image && (
          <div className="flex flex-col items-center w-full max-w-sm mx-auto aspect-square overflow-hidden border rounded-lg" style={{ maxHeight: '60vh' }}>
            <ReactCrop 
              crop={crop} 
              onChange={handleCropChange} 
              onComplete={(c) => setCompletedCrop(c)}  
              keepSelection 
              aspect={1} 
              minWidth={150}
              className="w-full h-full"
            >
              <img  
                ref={imgRef}  
                src={image} 
                alt="Preview" 
                onLoad={handleImageLoad} 
                className="w-full h-full object-contain rounded-lg"
                style={{ maxHeight: '60vh' }}
              />
            </ReactCrop>
          </div>
        )}
      </div>
    </>
  );
}