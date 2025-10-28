import axios from "axios";
 const axiosClient=axios.create({
    baseURL: "http://localhost:3000/api/order",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Important for cookies

})

export default axiosClient;