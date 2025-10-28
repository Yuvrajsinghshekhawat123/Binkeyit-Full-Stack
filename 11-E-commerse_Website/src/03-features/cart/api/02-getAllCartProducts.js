import axiosClient from "./axiosClient";

export async function getAllCartProducts() {
     const response =   await axiosClient.get("/getCartDetials");
    return response.data;
}