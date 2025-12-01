import axiosClient from "./01-axiosClient";

export async function deleteOrderByProductId(data) {
    const res =await axiosClient.post("/deleteProduct",data);
    return res.data;
}