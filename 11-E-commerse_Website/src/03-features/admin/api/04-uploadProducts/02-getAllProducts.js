import axiosClient from "../01-axiosClient";

export async function getAllProducts(){
    const res=await axiosClient.get("/getAll-products");
    return res.data;
}