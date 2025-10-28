import { RxCross2 } from "react-icons/rx";
import { FromForUploadAvatar } from "./form";
 
 

export function UploadCategoryModel({ setIsOpen }) {
   
  return (
    <>

    {/* // In EditAvatar component, update the container class: */}
     <div className="fixed z-50 top-1/2 left-1/2 w-[90%] h-[60%] max-w-md lg:max-w-xl max-h-[700px] md:w-[100%] md:h-[90%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-lg shadow-xl overflow-auto">
         <div className="flex justify-between cursor-pointer">
          <RxCross2
            className="inline"
            onClick={() => setIsOpen(false)}
            size={25}
          />

          <h1>Upload categroy</h1>

           
        </div>

        <FromForUploadAvatar setIsOpen={setIsOpen} />
      </div>
    </>
  );
}

