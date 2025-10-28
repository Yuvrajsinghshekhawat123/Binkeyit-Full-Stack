import axiosClient from "./01-axiosClient";

export async function addAddress(data) {
    const res=await axiosClient.post("/addAddress",data);
    return res.data;
}