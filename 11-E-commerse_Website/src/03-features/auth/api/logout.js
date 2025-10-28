import axiosClient from "./axiosClient";

export async function  LogoutUser(){
    const response=await axiosClient.get("/logout");
    return response.data;
}