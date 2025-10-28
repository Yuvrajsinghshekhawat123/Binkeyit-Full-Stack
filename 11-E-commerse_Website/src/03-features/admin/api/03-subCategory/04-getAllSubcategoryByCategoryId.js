import axiosClient from "../01-axiosClient";

export async function getAllSubCategoriesByCategoryId(categoryId){
    const res=await axiosClient.post("/getAll-subcategoriesByCategoryId",categoryId);
    return res.data;
}



