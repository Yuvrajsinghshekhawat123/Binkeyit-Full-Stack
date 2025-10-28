import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useAddAddress } from "../03-features/address/hook/01-useAddAddress";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useGetAllAddresses } from "../03-features/address/hook/02-useGetAllAddress";
import { useDeleteAddress } from "../03-features/address/hook/03-usedeleteAddressById";
import { Link, replace, useNavigate } from "react-router-dom";
import { useCOD } from "../03-features/order/hook/01-useCOD";
import { clearCart } from "../00-app/03-cartSlice";
import { useOnlinePayment } from "../03-features/order/hook/02-useOnlinePayment";
import { loadStripe } from "@stripe/stripe-js";
export function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobile: "",
  });

  const cartItems = useSelector((state) => state.cart.items) || {};

  const dispatch = useDispatch();

  // Calculate totals
  const itemsTotal = Object.values(cartItems).reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const totalItems = Object.values(cartItems).reduce(
    (sum, item) => sum + item.count,
    0
  );

  const savedAmount = Object.values(cartItems).reduce(
    (sum, item) =>
      sum +
      (item.discount ? ((item.price * item.discount) / 100) * item.count : 0),
    0
  );

  const deliveryCharge = 25; // example
  const handlingCharge = 2;

  const grandTotal = itemsTotal - savedAmount + handlingCharge;
  const subTotalAmt = itemsTotal - savedAmount;

  const { data, loading, error } = useGetAllAddresses();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (data?.addresses) {
      setAddresses(data.addresses);
    }
  }, [data]);

  // user can select only one address
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addAddress, setAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const handleSelect = (id) => {
    setSelectedAddress((prev) => (prev == id ? null : id));
  };

  const { mutate: deleteAddress } = useDeleteAddress();
  const [deleteAddressLoadingId, setDeleteAddressLoadingId] = useState(null);

  function handleDeleteButton(id) {
    if (selectedAddress === id) setSelectedAddress(null);

    const formData = new FormData();
    formData.append("id", id);
    setDeleteAddressLoadingId(id);
    deleteAddress(formData, {
      onSuccess: (data) => {
        toast.success(data.message);
        setDeleteAddressLoadingId(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete address");
      },
      onSettled: () => {
        setDeleteAddressLoadingId(null);
      },
    });
  }

  const { mutate: cod } = useCOD();
  const [codloading, setCODLoading] = useState(false);

  function handleCOD() {
    const product_details = Object.entries(cartItems).map(
      ([productId, item]) => ({
        ProductId: productId,
        Name: item.name,
        Quantity: item.count,
        Price: item.price,
        Discount: item.discount,
      })
    );

    const selectedAddressDetails = addresses.find(
      (addr) => addr.id === selectedAddress
    );

    const formData = new FormData();
    formData.append("product_details", JSON.stringify(product_details));
    formData.append("address", JSON.stringify(selectedAddressDetails));
    formData.append("subTotalAmt", subTotalAmt);
    formData.append("totalAmt", grandTotal);

    setCODLoading(true);
    cod(formData, {
      onSuccess: (data) => {
        dispatch(clearCart());
        navigate("/success", { replace: true });

        setCODLoading(false);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to  COD");
      },
      onSettled: () => {
        setCODLoading(false);
      },
    });
  }



  
 const { mutate: OnlinePayment } = useOnlinePayment();
const [onlinePaymentLoading, setOnlinePaymentLoading] = useState(false);

async function handleOnlinePayment() {
  setOnlinePaymentLoading(true);

  const product_details = Object.entries(cartItems).map(([productId, item]) => ({
    ProductId: productId,
    Name: item.name,
    Quantity: item.count,
    image: item.image,
    Price: item.price,
    Discount: item.discount,
  }));

   

  const payload = {
    product_details: JSON.stringify(product_details),
    addressId: selectedAddress,
    subTotalAmt,
    totalAmt: grandTotal,
  };

  OnlinePayment(payload, {
    onSuccess: (data) => {
      dispatch(clearCart());
      // Redirect to Stripe-hosted checkout page
      window.location.href = data.url;
    },
    onError: (err) => {
      console.error("Online payment error:", err);
      toast.error(err?.response?.data?.message || "Failed to make online payment");
      setOnlinePaymentLoading(false);
    },
     
  });
}


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
  }
  return (
    <>
      <section className="flex flex-col    lg:flex-row   w-[99vw]   gap-4 font-normal bg-white p-8 rounded-xl shadow-xl h-auto ">
        {/* Left Section: Address List */}
        <section className="w-full lg:w-[68vw] flex flex-col justify-between gap-4 h-auto ">
          <h1 className="font-bold text-2xl text-gray-800">
            Choose your address
          </h1>

          <div className="space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`flex items-center justify-between gap-3 p-3 border rounded-lg cursor-pointer transition
        ${
          selectedAddress === address.id
            ? "border-green-500 bg-green-50"
            : "border-gray-200"
        }`}
              >
                {/* Left: Radio + Address */}
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress === address.id}
                    onChange={() => handleSelect(address.id)}
                    className="accent-green-600"
                  />
                  <div className="text-gray-700 text-sm leading-6">
                    <p className="font-medium">{address.address_line}</p>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>
                      {address.country} - {address.pincode}
                    </p>
                    <p className="text-gray-600 text-sm">📞 {address.mobile}</p>
                  </div>
                </div>

                {/* Right: Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // prevent label click from selecting radio
                    handleDeleteButton(address.id);
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  {deleteAddressLoadingId === address.id ? (
                    <div className="flex items-center w-full justify-center gap-4 ">
                      <ClipLoader color="white" loading size={22} />{" "}
                    </div>
                  ) : (
                    <RxCross2 size={25} />
                  )}
                </button>
              </label>
            ))}
          </div>

          {addAddress && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setAddAddress(false)}
              ></div>

              {/* Modal Container */}
              <div className=" z-40 bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                {/* Your Address Form */}
                <AddressForm
                  setAddAddress={setAddAddress}
                  address={address}
                  setAddress={setAddress}
                />
              </div>
            </div>
          )}

          <div
            className="w-full text-center border border-gray-200 rounded-lg p-2 hover:bg-gray-200 cursor-pointer shadow-inner bg-green-50"
            onClick={() => setAddAddress((prev) => !prev)}
          >
            Add address
          </div>
        </section>

        {/* Right Section: Selected Info */}
        <section className="w-full lg:w-[30vw] bg-gray-50 p-4 rounded-xl    h-auto">
          <h1 className="font-bold text-xl">Summary</h1>
          {/* Bill Details */}
          <div className="   m-4  space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items total</span>
              <span>
                <span className="text-gray-400 line-through">
                  ₹{itemsTotal}
                </span>{" "}
                ₹{itemsTotal - savedAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery charge</span>
              <span>
                {" "}
                <span className="line-through text-gray-400">
                  ₹{deliveryCharge}{" "}
                </span>
                FREE
              </span>
            </div>
            <div className="flex justify-between">
              <span>Handling charge</span>
              <span>₹{handlingCharge}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 text-lg">
              <span>Grand total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700 my-4">
              Selected Address:
            </h2>
            {selectedAddress ? (
              (() => {
                const selected = addresses.find(
                  (addr) => addr.id === selectedAddress
                );
                return (
                  <div className="text-gray-800 text-sm leading-6 bg-gray-50 border border-gray-200 p-3 rounded-xl">
                    <p className="font-semibold text-base mb-1">
                      {selected.address_line}
                    </p>
                    <p>
                      {selected.city}, {selected.state}
                    </p>
                    <p>
                      {selected.country} - {selected.pincode}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      📞 {selected.mobile}
                    </p>
                  </div>
                );
              })()
            ) : (
              <p className="text-gray-500 italic">No address selected</p>
            )}
          </div>

          <div className="mt-10 max-w-md mx-auto space-y-4 relative  group">
            <div>
              <button
                onClick={handleOnlinePayment}
                className="block w-full text-center py-4 rounded-xl border border-gray-300 bg-white hover:bg-green-50 hover:border-green-400 transition-all shadow-sm text-gray-800 font-medium disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                disabled={selectedAddress == null || onlinePaymentLoading}
              >
                 {onlinePaymentLoading  ? (
                  <div className="flex items-center w-full justify-center gap-4 ">
                    <ClipLoader color="black" loading size={22} />{" "}
                    <span>Ordering...</span>
                  </div>
                ) : (
                  <span>Online Payment</span>
                )}
              </button>
            </div>
            <div className=" ">
              <button
                onClick={handleCOD}
                className="block w-full text-center py-4 rounded-xl border border-gray-300 bg-white hover:bg-green-50 hover:border-green-400 transition-all shadow-sm text-gray-800 font-medium disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                disabled={codloading || selectedAddress == null}
              >
                {codloading ? (
                  <div className="flex items-center w-full justify-center gap-4 ">
                    <ClipLoader color="black" loading size={22} />{" "}
                    <span>Ordering...</span>
                  </div>
                ) : (
                  <span>Cash on delivery</span>
                )}
              </button>

              {selectedAddress == null && (
                <div className="absolute -top-10 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-lg">
                  Please select the address
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default function AddressForm({ setAddAddress, address, setAddress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const { mutate } = useAddAddress();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(address).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setAddAddressLoading(true);

    mutate(formData, {
      onSuccess: (data) => {
        toast.success(data.message);
        setAddAddressLoading(false);
        setAddAddress(false); // close the modal
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to add address");
        setAddAddressLoading(false);
      },
      onSettled: () => {
        setAddAddressLoading(false);
        setAddress({
          address_line: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          mobile: "",
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full sm:max-w-lg mx-4 sm:mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg space-y-4 sm:space-y-6 overflow-y-auto max-h-[90vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center font-bold text-xl sm:text-2xl">
        <h1>Add Address</h1>
        <button
          type="button"
          onClick={() => setAddAddress(false)}
          className="text-2xl sm:text-3xl text-gray-600 hover:text-gray-800"
        >
          <RxCross2 />
        </button>
      </div>

      {/* Address Line */}
      <div className="flex flex-col w-full">
        <label
          htmlFor="address_line"
          className="mb-1 font-medium text-gray-700 text-sm sm:text-base"
        >
          Address Line
        </label>
        <input
          type="text"
          id="address_line"
          name="address_line"
          value={address.address_line}
          onChange={handleChange}
          placeholder="Enter your address"
          required
          className="bg-blue-50 w-full p-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
        />
      </div>

      {/* City & State side by side on larger screens */}
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="flex-1 flex flex-col">
          <label
            htmlFor="city"
            className="mb-1 font-medium text-gray-700 text-sm sm:text-base"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="City"
            required
            className="bg-blue-50 w-full p-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
          />
        </div>
        <div className="flex-1 flex flex-col mt-4 sm:mt-0">
          <label
            htmlFor="state"
            className="mb-1 font-medium text-gray-700 text-sm sm:text-base"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="State"
            required
            className="bg-blue-50 w-full p-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Country & Pincode side by side */}
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="flex-1 flex flex-col">
          <label
            htmlFor="country"
            className="mb-1 font-medium text-gray-700 text-sm sm:text-base"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            placeholder="Country"
            required
            className="bg-blue-50 w-full p-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
          />
        </div>
        <div className="flex-1 flex flex-col mt-4 sm:mt-0">
          <label
            htmlFor="pincode"
            className="mb-1 font-medium text-gray-700 text-sm sm:text-base"
          >
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            required
            className="bg-blue-50 w-full p-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col w-full">
        <label
          htmlFor="mobile"
          className="mb-1 font-medium text-gray-700 text-sm sm:text-base"
        >
          Mobile Number
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={address.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
          required
          className="bg-blue-50 w-full p-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-700 transition text-sm sm:text-base disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
        disabled={addAddressLoading}
      >
        {addAddressLoading ? (
          <div className="flex items-center w-full justify-center gap-4 ">
            <ClipLoader color="white" loading size={22} />{" "}
            <span>Saving...</span>
          </div>
        ) : (
          <span> Save Address</span>
        )}
      </button>
    </form>
  );
}
