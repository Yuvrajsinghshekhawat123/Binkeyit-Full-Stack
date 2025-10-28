import { MdCheckCircle, MdEdit } from "react-icons/md";

import { useSelector } from "react-redux";
import "react-image-crop/dist/ReactCrop.css"; // <-- here
import { useState } from "react";
import { EditAvatar } from "../../../03-features/auth/components/EditAvatar/editAvatar";
import { ChangePassword } from "../../../03-features/auth/components/changePassword/changePassword";
import { EditUserDetails } from "../../../03-features/auth/components/EditUserDetails/updateProfile";
 

export function Profile() {
  const userDetail = useSelector((state) => state.userDetail);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isPersonalInformation, setIsPersonalInformation] = useState(true);
  const [isShowUserUpdateComponent,setIsShowUserUpdateComponent]=useState(false);
  const [isChangePassword, setChangePassword] = useState(false);



  //change password
  

  return (
    <>
      <section className="flex flex-col   gap-4  mx-10">
        <div className="flex flex-col items-center gap-4 py-4 min-h-[30vh] w-full bg-gradient-to-r from-sky-100 via-indigo-100 to-white shadow-md rounded-xl text-sm lg:text-lg">
          <div className="w-32 h-32 rounded-full border-2 border-white flex items-center justify-center bg-gradient-to-r from-sky-400 via-indigo-400 to-white/60 relative  shadow-lg">
            {/* User Initial or Avatar */}

            {userDetail.avatar ? (
              <img
                src={userDetail.avatar}
                alt="avatar"
                className="w-full h-full  object-cover bg-white rounded-full"
              />
            ) : (
              <div className="text-6xl font-bold text-white">
                {userDetail.name[0].toUpperCase()}
              </div>
            )}

            <div className="absolute  bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 bg-white text-center w-8 h-8 rounded-full shadow-md  cursor-pointer ">
              <MdEdit
                onClick={() => setIsOpen2(true)}
                className="inline  text-black hover:text-gray-400 cursor-pointer "
                title="Edit Avatar"
                size={25}
              />
            </div>
          </div>

          <div className="text-sm  lg:text-2xl font-bold text-gray-700">
            {userDetail.name}
          </div>
          <div className="flex items-center justify-center flex-col md:flex-row  gap-2  divide-y-3 md:divide-y-0 md:divide-x-3 divide-gray-500 ">
            <div className="text-gray-400 px-2 ">
              {" "}
              <span className="text-xs lg:text-xl font-semibold md:font-bold text-gray-600 ">Member since: </span>
              {new Date(userDetail.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </div>

            <div>
              <div className="text-gray-400">
                {" "}
                <span className="text-xs lg:text-xl font-semibold md:font-bold text-gray-600">Last login: </span>
                {new Date(userDetail.last_login_date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </div>
            </div>
          </div>
          {/* "en-US" = English (United States).
                        🔹 The options { ... }
                        These tell JavaScript what parts of the date to show:

                        year: "numeric" → full year (e.g., 2023).
                        If "2-digit" → 23.

                        month: "long" → full month name (January).
                        If "short" → Jan.
                        If "numeric" → 1.

                        day: "numeric" → the day of the month (15).
                        If "2-digit" → 15 (always 2 digits, like 05).
                        
                        */}
        </div>

        <div>
          <div className="flex justify-start  gap-2  border-b border-gray-200 w-full">
            <div
              className={`mt-2 ${
                isPersonalInformation && "border-b-3 border-blue-500 "
              }`}
            >
              <button
                onClick={() => {
                  setChangePassword(false);
                  setIsPersonalInformation(true);
                }}
                className={`text-sm md:text-xl font-semibold md:font-bold  px-4 py-2 cursor-pointer ${
                  isPersonalInformation ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Profile Information
              </button>
            </div>
            <div
              className={`mt-2 ${
                isChangePassword && "border-b-3 border-blue-500 "
              }`}
            >
              <button
                onClick={() => {
                  setChangePassword(true);
                  setIsPersonalInformation(false);
                }}
                className={`text-xs md:text-xl font-semibold md:font-bold px-4 py-2 cursor-pointer  ${
                  isChangePassword ? "text-blue-600 " : "text-gray-500 "
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {isPersonalInformation && (
          <div className="flex flex-col gap-4 py-4 min-h-[30vh] w-full bg-gradient-to-r from-sky-100 via-indigo-100 to-white shadow-md rounded-xl p-4 ">
            <div className="flex justify-between w-full text-sm md:text-2xl font-bold text-gray-700 border-b border-gray-300 py-6">
               <h1>Personal Information</h1>
               <button onClick={()=>setIsShowUserUpdateComponent(true)}><MdEdit  className="inline text-black hover:text-gray-400 cursor-pointer text-lg lg:text-2xl" title="Edit Profile" /></button>
            </div>

            <div className="text-sm md:text-xl font-semibold text-gray-700 border-b border-gray-300 ">
              <h1>User Name</h1>
              <h1 className="font-normal text-xs md:text-lg">{userDetail.name}</h1>
            </div>
            <div className="text-sm md:text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2">
            {/* Label */}
            <h1 className="mb-1">Email</h1>

            {/* Email + Verified */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full font-normal text-xs md:text-lg">
              {/* Email */}
              <span className="break-all">{userDetail.email}</span>

              {/* Verified Badge */}
              {userDetail.verify_email && (
                <span className="flex items-center gap-1 text-green-700 text-xs md:text-lg mt-1 sm:mt-0">
                  <MdCheckCircle className="text-green-700 text-sm md:text-2xl" />
                  Verified
                </span>
              )}
            </div>
          </div>

            <div className="text-sm md:text-xl font-semibold text-gray-700 border-b border-gray-300 ">
              <h1>Mobile No.</h1>
              <h1 className="font-normal text-xs md:text-lg">
                {!!userDetail.mobile ? userDetail.mobile : "+918619540225"}
              </h1>
            </div>
            <div className="text-sm md:text-xl font-semibold text-gray-700 border-b border-gray-300 ">
              <h1>Role</h1>
              <h1 className="font-normal text-xs md:text-lg">{userDetail.role}</h1>
            </div>



          </div>
        )}

        {isChangePassword && (
          <div className="flex flex-col gap-4 py-4 min-h-[30vh] w-full bg-gradient-to-r from-sky-100 via-indigo-100 to-white shadow-md rounded-xl p-4">
            <div className="text-xs md:text-2xl font-bold text-gray-700 border-b border-gray-300 py-6">
              Change Password
            </div>
              <ChangePassword/>
          </div>
        )}






        {isOpen2 && (
          <div>
            {/* Dull background */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen2(false)}
            ></div>

            {isOpen2 && <EditAvatar setIsOpen={setIsOpen2} />}
          </div>
        )}

        {isShowUserUpdateComponent && (
          <div>
            {/* Dull background */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsShowUserUpdateComponent(false)}
            ></div>

            <EditUserDetails setIsShowUserUpdateComponent={setIsShowUserUpdateComponent}/>
          </div>
        )}
      </section>
    </>
  );
}
