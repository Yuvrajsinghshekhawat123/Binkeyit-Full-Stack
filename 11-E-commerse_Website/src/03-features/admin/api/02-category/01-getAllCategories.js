import axiosClient from "../01-axiosClient";


export async function getAllCategories(){
    const res=await axiosClient.get("/getAll-categories");
    return res.data
}