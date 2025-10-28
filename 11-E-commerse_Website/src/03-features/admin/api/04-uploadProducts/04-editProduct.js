import axiosClient from "../01-axiosClient";

export async function editProdcut(data) {
    const res=await axiosClient.put("/update-product",data,{
           headers:{
             "Content-Type": "multipart/form-data",
    }, 
    });
    return res.data;
}