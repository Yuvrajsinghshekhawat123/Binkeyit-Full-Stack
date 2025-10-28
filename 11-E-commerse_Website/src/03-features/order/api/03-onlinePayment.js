
import axiosClient from "./01-axiosClient";

export async function onlinePayment(data) {
    const res =await axiosClient.post("/checkout",data);
    return res.data;
}