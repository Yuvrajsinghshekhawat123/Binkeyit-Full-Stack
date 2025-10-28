import axiosClient from "./01-axiosClient";

export async function getAllAddress() {
    const res=await axiosClient.get("/getAllAddress");
    return res.data;
}