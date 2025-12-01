
import axiosClient from "./01-axiosClient";

export async function fedexTrackOrder(data) {
    const res =await axiosClient.post("/fedex/track",data);
    return res.data;
}