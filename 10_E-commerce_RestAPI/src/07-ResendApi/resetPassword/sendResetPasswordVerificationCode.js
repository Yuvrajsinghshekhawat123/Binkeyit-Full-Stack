 import { sendResetPasswordVerification } from "./Resend_services.js";
 
export async function sendResetPasswordVerificationCode(name,email,token) {
    try{

        
    if (!email || !token) {
      return { success: false, message: "Email and token are required" };
    }

 

  
         
    // send 6-digit code via email
    const emailResult = await sendResetPasswordVerification(name,email,token);
    if (!emailResult.success) {
      return { success: false, message: "Failed to send verification email" };
    }


     
    return { success: true, message: "Verification code sent successfully" };
 
        
    
    }catch(err){
         console.error("Send Verification Error: ", err);
        return { success: false, message: "Failed to send verification" };

    }
}