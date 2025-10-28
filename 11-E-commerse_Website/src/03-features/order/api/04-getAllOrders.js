import axiosClient from "./01-axiosClient";

export async function getAllOrdersDetails() {
    const res=await axiosClient.get("/getOrders");
    return res.data;
}