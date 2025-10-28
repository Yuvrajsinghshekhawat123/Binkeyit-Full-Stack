import axiosClient from "./01-axiosClient";

export async function  deleleAddress(id) {
    const res=await axiosClient.post("/deleteAddressbyId",id);
    return res.data;
}