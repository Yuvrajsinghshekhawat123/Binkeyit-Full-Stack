import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Search } from "../SearchBar/serach";
import { FaExternalLinkAlt, FaRegUserCircle } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useLogout } from "../../03-features/auth/hook/useLogout";
import { clearUserDetails } from "../../00-app/01-userSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { CartSidebar } from "./addToCart";
import { useAddCartDetials } from "../../03-features/cart/hook/01-useAddCartDetails";
import { useGetAllCartProduct } from "../../03-features/cart/hook/02-useGetAllCartProducts";
import { addToCart, clearCart } from "../../00-app/03-cartSlice";

export function NavBar() {
  const location = useLocation(); // means on search page do not show logo and login and add to cart
  const isSearchPage = location.pathname === "/search";
  const userDetail = useSelector((state) => state.userDetail);
   
  const [processing, setProcessing] = useState(false);

  // console.log(userDetail.userId);
  const [price, setPrice] = useState(1);
  const [openUserManu, setOpenUserManu] = useState(false); // when userId exits

  const [isOpen, setIsOpen] = useState(false);
  const { mutate: logout } = useLogout();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // fetch the add to cart detils
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = Object.values(cartItems).reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalPrice = Object.values(cartItems).reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const [showSideBar, setShowSideBar] = useState(false);

  async function handleLogoutButton() {
    logout(undefined, {
      onSuccess: async (data) => {
         
        setProcessing(false);
        toast.success(data.message);

        dispatch(clearUserDetails());
        dispatch(clearCart());
        queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      },
    });
  }

  /*
    When the component mounts, the listener is added.
    Any click outside the dropdown triggers setOpenUserManu(false) to close it.
    When the component unmounts, the listener is removed.


    */







  const { mutate: syncCart } = useAddCartDetials();
  

  const minimalCart = Object.entries(cartItems)
  .map(([productId, item]) => ({
    productId: Number(productId),
    quantity: item.count,
  }));
  
   

  // You should call this hook in the component where the cart is updated before the user leaves the website — for example:
   useEffect(() => {
     
  if (userDetail?.userId && Object.keys(cartItems).length >= 0) {
 

    syncCart({ cartItems: minimalCart}); // async, but page is still open
  }
}, [cartItems, userDetail?.userId])









const {data,loading}=useGetAllCartProduct();
useEffect(()=>{

  
  if (userDetail?.userId &&  data && data.success && data.cartItems) {
      
      // Update Redux store with cart items from backend
       Object.entries(data.cartItems).forEach(([productId,item])=>{
        dispatch(addToCart({
           productId: Number(productId),
            name: item.name,
            image: item.image,
            unit: item.unit,
            price: item.price,
            discount: item.discount,
        }))
       })
       
    }
},[data, dispatch])





 






  if (processing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
  }
  return (
    <>
      <section className="flex  justify-between w-full bg-white  lg:shadow-md font-light  fixed top-0 left-0 z-10 ">
        <div className="lg:w-[12vw] lg:border-r lg:border-gray-100 ">
          {!isSearchPage && (
            <div className="  h-full lg:mx-0 flex justify-start items-center hover:bg-gray-50 p-2">
              <Link to="/">
                <img src={logo} alt="logo" className="h-12  object-contain " />
              </Link>
            </div>
          )}
          {/* Logo */}

          {/* on lg screen on search page show the  "add to cart" button */}
          {isSearchPage && (
            <div className="hidden lg:flex lg:items-center h-full hover:bg-gray-50 p-4">
              <Link to="/">
                <img
                  src={logo}
                  alt="logo"
                  className="w-[12vw]  h-12 object-contain  "
                />
              </Link>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center w-full p-4 px-6 h-auto bg-white   font-light relative ">
          <div></div>

          {/* search item */}
          {!isSearchPage && (
            <div className="hidden lg:flex">
              <Search />
            </div>
          )}

          {isSearchPage && (
            <div className="hidden sm:flex sm:justify-center  w-full">
              <Search />
            </div>
          )}

          {!isSearchPage && (
            <div className="hidden lg:flex sm:items-center sm:gap-20 sm:px-2">
              {/* if user not exits */}
              {!isSearchPage && !userDetail?.userId && (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "underline text-blue-600 text-xl" : "text-xl"
                  }
                >
                  Login
                </NavLink>
              )}

              {/* if user exits */}
              {userDetail?.userId && (
                <div
                  className="p-2 rounded-lg shadow-sm font-medium z-50"
                  onClick={() => setIsOpen(true)}
                >
                  <button
                    type="button"
                    className="cursor-pointer  focus:outline-none"
                    onClick={() => setOpenUserManu((prev) => !prev)}
                  >
                    <h1 className="flex items-center gap-1">
                      Account{" "}
                      {openUserManu ? (
                        <GoTriangleDown className="text-4xl" />
                      ) : (
                        <GoTriangleUp className="text-4xl" />
                      )}
                    </h1>
                  </button>

                  {/* Dropdown */}
                  <div
                    className={` text-md  w-[17%]  absolute right-80 flex flex-col items-start   bg-white shadow-md rounded-sm p-3 transform transition-all duration-300 ease-in-out origin-top ${
                      openUserManu
                        ? "opacity-100 translate-y-4 scale-y-100"
                        : "opacity-0 -translate-y-2 scale-y-0"
                    }`}
                  >
                    <div className=" w-full mb-4 p-2">
                      <h1 className="text-xl font-bold ">My Account</h1>
                      <div className="flex items-center gap-2 py-2">
                        <h1 className="font-normal text-gray-600 text-lg">
                          {userDetail.name}
                        </h1>
                        <Link
                          onClick={() => setOpenUserManu(false)}
                          to="/account/profile"
                        >
                          <FaExternalLinkAlt
                            className="text-gray-500 hover:text-black"
                            size={20}
                          />
                        </Link>
                      </div>

                      <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-300"></div>
                    </div>

                    <div className="w-full text-gray-600 font-normal p-2">
                      <button
                        onClick={() => setOpenUserManu(false)}
                        className="hover:bg-gray-200 cursor-pointer w-full text-left"
                      >
                        <Link to="/account/orders">My Orders</Link>
                      </button>
                    </div>
                    <div className="w-full text-gray-600 font-normal p-2">
                      <button
                        onClick={() => setOpenUserManu(false)}
                        className="hover:bg-gray-200 cursor-pointer w-full text-left"
                      >
                        <Link to="/account/addresses">Saved Addresses</Link>
                      </button>
                    </div>
                    <div className="w-full text-gray-600 font-normal p-2">
                      <button
                        className="hover:bg-gray-200 cursor-pointer w-full text-left"
                        onClick={handleLogoutButton}
                      >
                        Log Out
                      </button>
                    </div>
                    {/* When menu closed → we apply scale-y-0, so the height shrinks down to nothing. */}
                    {/* When menu open → we apply scale-y-100, so it expands back to full size. */}
                    {/* origin-top -> means the transform happens from the top edge of the element. */}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowSideBar((prev) => !prev)}
                className=" w-30 h-12 bg-green-700 rounded-lg flex items-center gap-2 p-1 text-white text-sm font-bold disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                disabled={totalItems <= 0}
              >
                <MdOutlineShoppingCart className="text-2xl animate-bounce" />

                {totalItems > 0 ? (
                  <div>
                    <h1
                      className={`${
                        10 > 9999 ? "text-xs" : "text-sm"
                      } min-w-[60px]`}
                    >
                      {totalItems} items
                    </h1>

                    <h1
                      className={`${
                        10 > 9999 ? "text-xs" : "text-sm"
                      } min-w-[60px]`}
                    >
                      ₹ {totalPrice}
                    </h1>
                  </div>
                ) : (
                  <span className="text-gray-300">My Cart </span>
                )}
              </button>
            </div>
          )}

          {/* Overlay (black background with opacity) */}
          {!isSearchPage && userDetail?.userId && openUserManu && isOpen && (
            <div
              className="fixed inset-0 top-28 lg:top-21 bottom-0 bg-black/50  z-40"
              onClick={() => {
                setIsOpen(false);
                setOpenUserManu(false);
              }}
            ></div>
          )}

          {/* on lg screen on search page show the  "add to cart" button */}
          {isSearchPage && (
            <div
              className="hidden lg:flex"
              onClick={() => setShowSideBar((prev) => !prev)}
            >
              <button
                className=" w-30 h-12 bg-green-700 rounded-lg flex items-center gap-2 p-1 text-white text-sm font-bold disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                disabled={totalItems <= 0}
              >
                <MdOutlineShoppingCart className="text-2xl animate-bounce" />

                {totalItems > 0 ? (
                  <div>
                    <h1
                      className={`${
                        10 > 9999 ? "text-xs" : "text-sm"
                      } min-w-[60px]`}
                    >
                      {totalItems} items
                    </h1>

                    <h1
                      className={`${
                        10 > 9999 ? "text-xs" : "text-sm"
                      } min-w-[60px]`}
                    >
                      ₹ {totalPrice}
                    </h1>
                  </div>
                ) : (
                  <span className="text-gray-300">My Cart</span>
                )}
              </button>
            </div>
          )}

          {/* if user not exits */}
          {!isSearchPage && !userDetail.userId && (
            <div className="px-6 lg:hidden text-2xl ">
              <Link to="/login">
                <FaRegUserCircle />
              </Link>
            </div>
          )}
          {/* if user exits */}
          {!location.pathname.startsWith("/account") &&
            !isSearchPage &&
            userDetail?.userId && (
              <div className="px-4 lg:hidden text-2xl z-10 w-full text-right">
                <button
                  type="button"
                  className="cursor-pointer focus:outline-none"
                  onClick={() => setOpenUserManu((prev) => !prev)}
                >
                  <Link to="/account">
                    <FaRegUserCircle />
                  </Link>
                </button>
              </div>
            )}

          {/* search (mobile only) */}
        </div>
      </section>

      {!isSearchPage && (
        <div className="lg:hidden pb-2 bg-white shadow-md w-[100%] fixed top-15 z-10">
          <Search />
        </div>
      )}

      {isSearchPage && (
        <div className="md:hidden pb-2 bg-white shadow-md w-[100%] fixed top-5 z-10">
          <Search />
        </div>
      )}

      {/* show side bar */}
      {/* Cart Sidebar Overlay + Panel */}
      {showSideBar && (
        <>
          {/* Overlay (dark background) */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setShowSideBar(false)}
          ></div>

          <div
            className={`fixed top-0 right-0 h-full
  w-full sm:w-[430px] md:w-[400px] 
  bg-white shadow-2xl z-50 
  transform transition-transform duration-300 ease-in-out 
  ${showSideBar ? "translate-x-0" : "translate-x-full"}`}
          >
            <CartSidebar setShowSideBar={setShowSideBar} />
          </div>
        </>
      )}

      {/* show add to cart button on sm,md only on dowon side */}
      {!showSideBar ? (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 lg:hidden z-50 font-normal bg-white border-t border-gray-200
 "  
          onClick={() => setShowSideBar((prev) => !prev)}
        >
          <button className="w-full flex justify-between items-center bg-green-600 text-white rounded-xl py-3 px-4 shadow-md active:scale-95 transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-30" disabled={totalItems <= 0}>
            {/* Left Side: Cart + Item Details */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <MdOutlineShoppingCart className="text-2xl animate-bounce" />
              </div>
              <div className="text-left leading-tight">
                <p className="font-semibold text-sm">{totalItems} items</p>
                <p className="text-xs opacity-90">₹{totalPrice}</p>
              </div>
            </div>

            {/* Right Side: View Cart */}
            <p className="font-semibold text-sm bg-white text-green-700 rounded-lg px-3 py-1">
              View Cart {totalItems}
            </p>
          </button>
        </div>
      ) : (
        <div className="hidden">
          <CartSidebar />
        </div>
      )}

      {/* Just add pt-[height-of-navbar] (padding-top)  so the content starts below the fixed navbar. */}
      <section className="lg:pt-20 pt-27"></section>
    </>
  );
}
