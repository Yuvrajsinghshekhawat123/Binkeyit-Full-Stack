import axiosClient from "../01-axiosClient";

export async function deleteSubCategoryById(id) {
    const res=await axiosClient.delete(`/delete-subcategoryById/${id}`);
    return res.data;
}