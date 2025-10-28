import { Resend } from "resend";
import { emailVerificationTemplate } from "./EmailTemplates.js";
 
const resend=new Resend(process.env.RESEND_API_KEY);
export async function sendEmailVerification(userName,userEmail,code) {
    try{
        const {data,error}=await resend.emails.send({
            
            from:"Acme <onboarding@resend.dev>",
            to:userEmail,
            subject: "Email verification",
            html:emailVerificationTemplate(userName,code)
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