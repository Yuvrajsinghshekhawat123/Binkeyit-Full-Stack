import axiosClient from "./axiosClient";

export async function addCartDetials({cartItems}) {
     const response = await axiosClient.post("/addCartDetials", {cartItems});
    return response.data;
}