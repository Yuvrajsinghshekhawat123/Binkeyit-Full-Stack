import axiosClient from "../01-axiosClient";

export async function getProductsByCategoryAndSubcategory(data) {
   // simulate 1-second delay
   
  const res = await axiosClient.post(
    "/get-productsByCategoryIdAndSubcategoryId",
    data
  );

  await new Promise((resolve) => setTimeout(resolve, 500));
  return res.data;
}
