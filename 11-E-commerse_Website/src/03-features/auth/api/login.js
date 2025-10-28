import axiosClient from "./axiosClient";

export async function LoginUser(data){
    const response=await axiosClient.post("/login",data);
    return response.data;
}


export async function ForgotPassword(data){
    const response=await axiosClient.post("/forgot-password",data);
    return response.data;
}



export async function VerifyOTP(data){
    const response=await axiosClient.post("/verify-otp",data);
    return response.data;
}
export async function ResendResetPasswordCode(data){
    const response=await axiosClient.post("/resend-reset-password-otp",data);
    return response.data;
}


export async function ResetPassword(data){
    const response=await axiosClient.post("/resetPassword",data);
    return response.data;
}



// get user deteails after login 
export async function LoginUserDetails() {
    const response =await axiosClient.get("/userDetails");
    return response.data;
}


// upload avatar
// upload avatar
export async function uploadAvatar(formData) {
    const response = await axiosClient.put("/upload-avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}
//Axios: Defaults to sending it as application/json.
//Backend: Multer expects multipart/form-data, not JSON.
// Result: Node tries to parse the PNG binary as JSON → fails → SyntaxError: Unexpected token '�'.



export async function DeleteAvatar() {
    const res=await axiosClient.delete("/delete-avatar")
    return res.data;
}


export async function  UpdateUserDetails(data) {
    const res=await axiosClient.put("/update-profile",data)
    return res.data;
}


export async function ChangeEmailVerification(data){
    const response=await axiosClient.post("/verifyEmailChange",data);
    return response.data;
}


export async function ChangeUserPassword(data){
    const response=await axiosClient.post("/change-password",data);
    return response.data;
}

