 
import axiosClient from "../01-axiosClient";

export async function getProductByProductId(data) {
   
  const res = await axiosClient.post(
    "/get-productByProductId",
    data
  );
  return res.data;
}

