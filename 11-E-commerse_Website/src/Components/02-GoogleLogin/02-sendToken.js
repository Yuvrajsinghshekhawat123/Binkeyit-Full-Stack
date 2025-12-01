import axiosClient from "./01-api";

export async function sendToken(data) {
    const res=await axiosClient.post("/googleLogin",data);
    return res.data;
}