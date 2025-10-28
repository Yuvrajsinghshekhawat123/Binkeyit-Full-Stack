import axiosClient from "./01-axiosClient";

export async function COD(data) {
    const res =await axiosClient.post("/cod",data);
    return res.data;
}