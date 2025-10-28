import axiosClient from "../01-axiosClient";

export async function getProductsBySearchName({query,data}){
    const res=await axiosClient.post(`/getAll-searchProducts?q=${query}`,data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return res.data;
}