import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { useDeleteAvatar } from "../../hook/useDeleteAvatar";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FromForUploadAvatar } from "../uploadAvatar/form";

export function EditAvatar({ setIsOpen }) {
  const [isprocessing, setProcessing] = useState(false);
  const { mutate: deleteAvatar } = useDeleteAvatar();
  const queryClient = useQueryClient();

  function handleDeleteAvatar() {
    setProcessing(true);
    deleteAvatar(undefined, {
      onSuccess: async (data) => {
        toast.success(data.message)
        await queryClient.invalidateQueries({ queryKey: ["userDetails"] });
        await new Promise((resolve) => setTimeout(resolve, 100));
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      },
      onSettled: () => {
        setProcessing(false); // Stop processing after request completes
        setIsOpen(false);
      },
    });
  }

  return (
    <>

    {/* // In EditAvatar component, update the container class: */}
    <div className="fixed z-50 top-1/2 left-1/2 w-[90%] h-[80%] max-w-md max-h-[500px] md:w-[40%] md:h-[90%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-lg shadow-xl overflow-auto">
         <div className="flex justify-between cursor-pointer">
          <RxCross2
            className="inline"
            onClick={() => setIsOpen(false)}
            size={25}
          />

          <h1>Edit Profile Photo</h1>

          <button
            className="text-black disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteAvatar}
            disabled={isprocessing}
          >
            {isprocessing ? (
              <ClipLoader className="inline" size={25} />
            ) : (
              <RiDeleteBinLine className="inline cursor-pointer " size={25} />
            )}
          </button>
        </div>

        <FromForUploadAvatar setIsOpen={setIsOpen} />
      </div>
    </>
  );
}
