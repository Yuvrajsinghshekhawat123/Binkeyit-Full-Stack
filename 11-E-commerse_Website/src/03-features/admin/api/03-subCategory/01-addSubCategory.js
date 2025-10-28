import axiosClient from "../01-axiosClient";

export async function addSubCategory(data) {
    const res=await axiosClient.post("/add-subcategories",data,{
        headers:{
      "Content-Type": "multipart/form-data",
    }, 
    })

    return res.data;
}