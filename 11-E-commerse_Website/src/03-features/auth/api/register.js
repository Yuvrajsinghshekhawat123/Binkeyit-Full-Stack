import axios from "axios";
import axiosClient from "./axiosClient";

export async function registerUser(data) {
    
    const response=await axiosClient.post("/register",data);
    console.log(response)
    return response.data;
}

export async function verifyEmail(data){
    const response = await axiosClient.post("/verify-email", data);
    return response.data;
}


export async function ResendCode(data){
    const response = await axiosClient.post("/resend-Code", data);
    return response.data;
}

