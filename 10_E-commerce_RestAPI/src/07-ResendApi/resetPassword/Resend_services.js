import { Resend } from "resend";
import { resetPasswordTemplate } from "./resetPassTemplate.js";
const resend=new Resend(process.env.RESEND_API_KEY);
export async function sendResetPasswordVerification(userName,userEmail,code) {
    try{
        const {data,error}=await resend.emails.send({
            
            from:"Acme <onboarding@resend.dev>",
            to:userEmail,
            subject: "Reset Password",
            html:resetPasswordTemplate(userName,code)
        });

         console.log(data,error);
        if(error){
            return {success:false,message:error.message}
        }
        return {success:true,message:data};
    }catch(err){
        return { success: false, message:err.message };
    }
}