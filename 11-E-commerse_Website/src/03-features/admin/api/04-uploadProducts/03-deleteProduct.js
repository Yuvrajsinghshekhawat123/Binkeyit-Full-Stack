import axiosClient from "../01-axiosClient";

export async function deleteProductById(id){
    const res=await axiosClient.delete(`/delete-productByd/${id}`);
    return res.data;
}