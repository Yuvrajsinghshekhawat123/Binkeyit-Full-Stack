import { BiCategory } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { FaBoxOpen } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { IoMdCloudUpload } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";
import { Link } from "react-router-dom";

export function MyProfile({isActivePath}) {
  return (
    <>
      <Link
        to="/account/profile"
        className={`px-2 py-5 w-full hover:bg-gray-100 space-x-2 flex items-center ${
          isActivePath("/account/profile") ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        <CiUser className="inline" />
        <p className="inline">My Profile</p>
      </Link>
    </>
  );
}
export function My_Addresses({isActivePath}) {
  return (
    <>
      <Link
        to="/account/addresses"
        className={`px-2 py-5 w-full hover:bg-gray-100 space-x-2 flex items-center ${
          isActivePath("/account/addresses") ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        <GrMapLocation className="inline" />
        <p className="inline">My Addresses</p>
      </Link>
    </>
  );
}
export function MyOrders({isActivePath}) {
  return (
    <>
      <Link
        to="/account/orders"
        className={`px-2 py-5 w-full hover:bg-gray-100 space-x-2 flex items-center ${
          isActivePath("/account/orders") ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        <LuNotebookPen className="inline" /> <p className="inline">My Orders</p>
      </Link>
    </>
  );
}
export function MyCategory({isActivePath}) {
  return (
    <>
      <Link
        to="/account/admin/category"
        className={`px-2 py-5 w-full hover:bg-gray-100 space-x-2 flex items-center ${
          isActivePath("/account/admin/category") ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        <BiCategory className="inline" /> <p className="inline">Category</p>
      </Link>
    </>
  );
}
export function MySubCategory({isActivePath}) {
  return (
    <>
      <Link
        to="/account/admin/sub-category"
        className={`px-2 py-5 w-full hover:bg-gray-100 space-x-2 flex items-center ${
          isActivePath("/account/admin/sub-category") ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        <BiCategory className="inline" /> <p className="inline">Sub Category</p>
      </Link>
    </>
  );
}
export function MyUploadProduct({isActivePath}) {
  return (
    <>
      <Link
        to="/account/admin/upload-products"
        className={`px-2 py-5 w-full hover:bg-gray-100 space-x-2 flex items-center ${
          isActivePath("/account/admin/upload-products") ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        <IoMdCloudUpload className="inline" />{" "}
        <p className="inline">Upload Products</p>
      </Link>
    </>
  );
}
  