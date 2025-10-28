import axiosClient from "../01-axiosClient";

export async function deleteCategoryById(id) {
    const res=await axiosClient.delete(`/delete-categoryById/${id}`);
    return res.data;
}