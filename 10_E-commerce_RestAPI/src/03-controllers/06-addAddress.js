import { json, success } from "zod";
import { deleleAddressById, getAllAddressOfUser, insertAddress } from "../02-models/02-address.js";
export async function AddAddress(req, res) {
  try {
    const { address_line, city, state, country, pincode, mobile } = req.body;

    // Call your model function to insert into DB
    await insertAddress(
      req.userId,
      address_line,
      city,
      state,
      country,
      pincode,
      mobile
    );

    return res.json({ success: true, message: "Address successfully added" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// get all address for particul user
export async function getAllAddress(req, res) {
  try {
    const result = await getAllAddressOfUser(req.userId);

    // If user has no saved addresses
    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No addresses found for this user",
        addresses: [],
      });
    }

    // Map addresses to clean structure
    const addresses = result.map((address) => ({
      id: address.id,
      address_line: address.address_line,
      city: address.city,
      state: address.state, // include state if present
      country: address.country,
      pincode: address.pincode,
      mobile: address.mobile,
    }));

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}







//delelet the address
export async function deleleAddress(req,res) {
  try {
    const {id}=req.body;
    await deleleAddressById(id,req.userId);

    return res.json({success:true,message:"Address deleted succeeful"});
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}





