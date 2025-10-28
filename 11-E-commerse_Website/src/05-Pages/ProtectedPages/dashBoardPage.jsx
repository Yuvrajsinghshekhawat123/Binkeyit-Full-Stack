import { RiLogoutCircleLine } from "react-icons/ri";
import { useLocation} from "react-router-dom";
import { useLogout } from "../../03-features/auth/hook/useLogout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearUserDetails } from "../../00-app/01-userSlice";
import { useQueryClient } from "@tanstack/react-query";
import { Profile } from "./dashboardSubPages/01-Profile";
import { Myorders } from "./dashboardSubPages/02-MyOrders";
import { MyAddresses } from "./dashboardSubPages/03-Myaddress";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Category } from "./dashboardSubPages/Admin/01-category";
import { SubCategory } from "./dashboardSubPages/Admin/02-Sub-category";
import { UploadProduct } from "./dashboardSubPages/Admin/03-upload-product";
import { My_Addresses, MyCategory, MyOrders,   MyProfile, MySubCategory, MyUploadProduct } from "../../03-features/auth/components/ProfilePageNavigationLinks/links";
import { clearCart } from "../../00-app/03-cartSlice";

export function Dashboard() {
  const { mutate: logout } = useLogout();
  const userDetail = useSelector((state) => state.userDetail);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check which section is active based on the current path
  const isActivePath = (path) => {
    return location.pathname.startsWith(path); // return true if the particular path starts from following routs
  };

  async function handleLogoutButton() {
    setIsLoggingOut(true);
    logout(undefined, {
      onSuccess: async (data) => {
        console.log(data);
        toast.success(data.message);
        dispatch(clearUserDetails());
        dispatch(clearCart());
        queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      },
      onError: (error) => {
        toast.error(error.message || "Logout failed");
        setIsLoggingOut(false);
      },
      onSettled: () => {
        setIsLoggingOut(false);
      },
    });
  }

  return (
    <>
      {/* center the box */}
      <section className="hidden  lg:flex lg:justify-center lg:w-full ">

        {/* divide section into two parts */}
        {/* h-[80vh]  overflow-y-auto  ----> apply scrolling on whole box */}
        <section className="grid grid-cols-1 md:grid-cols-[30%_70%] w-full max-w-7xl   my-10 md:my-20 shadow-xl rounded-xl bg-white mx-4 md:mx-0   h-[80vh]  overflow-y-auto">
          {/* left side for userMenu */}
          <section className="flex flex-col gap-4 p-2 border-b md:border-r border-gray-300 h-full">
            <div className="text-center p-4 font-semibold text-lg text-gray-600 space-y-2">
                <div>  {userDetail.name} {userDetail.role==="admin" && <span className="ml-2 px-2 py-1 text-xs rounded-md bg-red-100 text-red-600">Admin</span>}</div>
                <div className="font-normal">{userDetail.mobile}</div>

            </div>

            {/* -mx-2 cancels the parent's horizontal padding so dividers reach border */}
            <div className="flex flex-col divide-y divide-gray-300 -mx-2 font-normal text-lg text-gray-600">
              {/* upper border */}
              <div></div>
               <MyProfile isActivePath={isActivePath}/>

              {userDetail.role === "user" && (
                 <My_Addresses isActivePath={isActivePath}/>
              )}

              {userDetail.role === "user" && (
                 <MyOrders isActivePath={isActivePath}/>
              )}

              {userDetail.role === "admin" && (
                 <MyCategory isActivePath={isActivePath}/>
              )}
              {userDetail.role === "admin" && (
                 <MySubCategory isActivePath={isActivePath}/>
              )}
               
              {userDetail.role === "admin" && (
                <MyUploadProduct isActivePath={isActivePath}/>
              )}

              <button
                onClick={handleLogoutButton}
                disabled={isLoggingOut}
                className="px-2 py-5 w-full hover:bg-gray-100 space-x-2 text-left flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <ClipLoader size={20} color="#4B5563" className="mr-2" />
                ) : (
                  <RiLogoutCircleLine className="inline" />
                )}
                <p className="inline">
                  {isLoggingOut ? "Logging out..." : "LogOut"}
                </p>
              </button>
              <div></div>
            </div>
          </section>

          {/* right side for subPage rendering */}
          {/* Ah! overflow-y-auto is a CSS class (commonly used in Tailwind CSS) that controls vertical scrolling. Let me break it down carefully: */}
          {/*  min-h-[80vh] overflow-y-auto  ---->  apply scrolling on right side only when hight is greater then 80vh */}
          <section className="p-4 md:p-8 font-normal text-lg text-gray-600 min-h-[80vh] overflow-y-auto">
            {isActivePath("/account/profile") && <Profile />}
            {isActivePath("/account/orders") && <Myorders />}
            {isActivePath("/account/addresses")  && <MyAddresses />}
            {isActivePath("/account/admin/category")  && userDetail.role === "admin" && <Category />}
            {isActivePath("/account/admin/sub-category")  && userDetail.role === "admin" && <SubCategory />}
            {isActivePath("/account/admin/products")  && userDetail.role === "admin" && <Product />}
            {isActivePath("/account/admin/upload-products")  && userDetail.role === "admin" && <UploadProduct />}


            {/* Fallback if no matching route */}
            {location.pathname.startsWith("/account") &&
              !isActivePath("/account/profile") &&
              !isActivePath("/account/addresses") &&
              !isActivePath("/account/orders") &&
              !isActivePath("/account/admin/category") &&
              !isActivePath("/account/admin/sub-category") &&
              !isActivePath("/account/admin/products") &&
              !isActivePath("/account/admin/upload-products") && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Select a section from the menu
                  </p>
                </div>
              )}
          </section>
        </section>
      </section>

      {/* on mobile screen */}
      <section className="lg:hidden ">
        {location.pathname.startsWith("/account") && (
          <div>
            {/* Left side menu */}
            {/* when click on route then it remove the menu and show only pages */}
            {location.pathname.startsWith("/account") &&
              !isActivePath("/account/profile") &&
              !isActivePath("/account/orders") &&
              !isActivePath("/account/addresses") &&
              !isActivePath("/account/admin/category")  &&
              !isActivePath("/account/admin/sub-category") &&
              !isActivePath("/account/admin/products") &&
              !isActivePath("/account/admin/upload-products") && (
                <section>
                  <div className="flex flex-col items-center p-3 py-6 my-2 text-lg text-gray-600 font-semibold">
                            <div>  {userDetail.name} {userDetail.role==="admin" && <span className="ml-2 px-2 py-1 text-xs rounded-md bg-red-100 text-red-600 ">Admin</span>}</div>
                            <div className="font-normal">{userDetail.mobile}</div>
                  </div>
                  <div className="flex flex-col divide-y divide-gray-300 -mx-2 font-normal text-lg text-gray-600 px-2">
                    {/* upper border */}
                    <div></div>
                <MyProfile isActivePath={isActivePath}/> 

              {userDetail.role === "user" && (
                 <My_Addresses isActivePath={isActivePath}/>
              )}

              {userDetail.role === "user" && (
                 <MyOrders isActivePath={isActivePath}/>
              )}

              {userDetail.role === "admin" && (
                 <MyCategory isActivePath={isActivePath}/>
              )}
              {userDetail.role === "admin" && (
                 <MySubCategory isActivePath={isActivePath}/>
              )}
              
              {userDetail.role === "admin" && (
                <MyUploadProduct isActivePath={isActivePath}/>
              )}
                    <button
                      onClick={handleLogoutButton}
                      disabled={isLoggingOut}
                      className="px-2 py-5 w-full hover:bg-gray-100 space-x-2 text-left flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <ClipLoader
                          size={20}
                          color="#4B5563"
                          className="mr-2"
                        />
                      ) : (
                        <RiLogoutCircleLine className="inline" />
                      )}
                      <p className="inline">
                        {isLoggingOut ? "Logging out..." : "LogOut"}
                      </p>
                    </button>
                    <div></div>
                  </div>
                </section>
              )}

            {/* right side menu */}

            <section className="p-4 md:p-8 font-normal text-lg text-gray-600">
              {isActivePath("/account/profile") && <Profile />}
            {isActivePath("/account/orders") && <Myorders />}
            {isActivePath("/account/addresses") && <MyAddresses />}
            {isActivePath("/account/admin/category")   && userDetail.role === "admin" && <Category />}
            {isActivePath("/account/admin/sub-category")  && userDetail.role === "admin" && <SubCategory />}
            {isActivePath("/account/admin/upload-products")  && userDetail.role === "admin"  && <UploadProduct />}


            {/* Fallback if no matching route */}
            {location.pathname.startsWith("/account") &&
              !isActivePath("/account/profile") &&
              !isActivePath("/account/orders") &&
              !isActivePath("/account/addresses") &&
              !isActivePath("/account/admin/category") &&
              !isActivePath("/account/admin/sub-category") &&
              !isActivePath("/account/admin/upload-products") && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Select a section from the menu
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </>
  );
}
