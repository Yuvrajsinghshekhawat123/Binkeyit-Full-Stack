import axiosClient from "../01-axiosClient";

export async function getAllSubCategories(){
    const res=await axiosClient.get("/getAll-subcategories");
    return res.data;
}



