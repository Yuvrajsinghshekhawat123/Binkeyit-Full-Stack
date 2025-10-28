  

 import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useAddAddress } from "../../../03-features/address/hook/01-useAddAddress";  
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useGetAllAddresses } from "../../../03-features/address/hook/02-useGetAllAddress"; 
import { useDeleteAddress } from "../../../03-features/address/hook/03-usedeleteAddressById"; 

export function MyAddresses() {
  const [address, setAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobile: "",
  });

  const { data, loading } = useGetAllAddresses();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (data?.addresses) {
      setAddresses(data.addresses);
    }
  }, [data]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addAddress, setAddAddress] = useState(false);

  const { mutate: deleteAddress } = useDeleteAddress();
  const [deleteAddressLoadingId, setDeleteAddressLoadingId] = useState(null);

  function handleSelect(id) {
    setSelectedAddress((prev) => (prev === id ? null : id));
  }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full  gap-4 font-normal bg-white p-8 rounded-xl shadow-xl h-auto">
      <h1 className="font-bold text-2xl text-gray-800">Choose your address</h1>

      {/* Address List */}
      <div className="space-y-3">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`flex items-center justify-between gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedAddress === address.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
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

            {/* Delete Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteButton(address.id);
              }}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              {deleteAddressLoadingId === address.id ? (
                <div className="flex items-center justify-center">
                  <ClipLoader color="red" loading size={20} />
                </div>
              ) : (
                <RxCross2 size={30} />
              )}
            </button>
          </label>
        ))}
      </div>

      {/* Add Address Button */}
      <div
        className="w-full text-center border border-gray-200 rounded-lg p-2 hover:bg-gray-200 cursor-pointer shadow-inner bg-green-50"
        onClick={() => setAddAddress((prev) => !prev)}
      >
        Add address
      </div>

      {/* Modal */}
      {addAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAddAddress(false)}
          ></div>
          <div className="z-40 bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <AddressForm
              setAddAddress={setAddAddress}
              address={address}
              setAddress={setAddress}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function AddressForm({ setAddAddress, address, setAddress }) {
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
        setAddAddress(false);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to add address");
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
      className="w-full max-w-full sm:max-w-lg mx-4 sm:mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 overflow-y-auto max-h-[90vh]"
    >
      <div className="flex justify-between items-center font-bold text-xl">
        <h1>Add Address</h1>
        <button
          type="button"
          onClick={() => setAddAddress(false)}
          className="text-2xl text-gray-600 hover:text-gray-800"
        >
          <RxCross2 />
        </button>
      </div>

      {[
        { label: "Address Line", name: "address_line" },
        { label: "City", name: "city" },
        { label: "State", name: "state" },
        { label: "Country", name: "country" },
        { label: "Pincode", name: "pincode" },
        { label: "Mobile Number", name: "mobile" },
      ].map((field) => (
        <div key={field.name} className="flex flex-col w-full">
          <label className="mb-1 font-medium text-gray-700 text-sm">
            {field.label}
          </label>
          <input
            type="text"
            name={field.name}
            value={address[field.name]}
            onChange={handleChange}
            placeholder={field.label}
            required
            className="bg-blue-50 w-full p-3 text-sm border-2 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-50"
        disabled={addAddressLoading}
      >
        {addAddressLoading ? (
          <div className="flex items-center justify-center gap-2">
            <ClipLoader color="white" size={22} />
            <span>Saving...</span>
          </div>
        ) : (
          "Save Address"
        )}
      </button>
    </form>
  );
}
