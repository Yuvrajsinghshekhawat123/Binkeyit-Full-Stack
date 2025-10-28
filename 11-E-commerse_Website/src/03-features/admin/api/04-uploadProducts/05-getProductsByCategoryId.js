import axiosClient from "../01-axiosClient";

export async function getProductsByCategory(id) {
    const res=await axiosClient.post("/get-productsByCategoryId",{id});
    return res.data;
}