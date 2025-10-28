import axiosClient from "../01-axiosClient";

export async function addproducts(data) {
    const res=await axiosClient.post("/add-porducts",data,{
        headers:{
            "Content-Type": "multipart/form-data",
        },
    })
    return res.data;
}