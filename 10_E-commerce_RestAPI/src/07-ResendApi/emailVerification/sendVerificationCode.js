 
import { sendEmailVerification } from "./Resend_services.js";
 
export async function sendVerificationCode(name,email,token) {
    try{

      





        
    if (!email || !token) {
      return { success: false, message: "Email and token are required" };
    }

 

    console.log(email,token)
         
    // send 6-digit code via email
    const emailResult = await sendEmailVerification(name,email,token);
    if (!emailResult.success) {
      return { success: false, message: "Failed to send verification email" };
    }


     
    return { success: true, message: "Verification code sent successfully" };

        
    
    }catch(err){
         console.error("Send Verification Error: ", err);
        return { success: false, message: "Failed to send verification" };

    }
}


/*
Q-1 if you’re following the “verify first, then create the user” flow. then how we know the user id?
 

CREATE TABLE emailVerification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT false,
    method VARCHAR(20) DEFAULT 'email',
    expiresAt DATETIME NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



⚡ Recommendation:
If you don’t want unverified junk in users, go with Option A (store details in emailVerification table).
Then on successful verification, you “promote” them into the users table.





Unverified accounts stay in " emailVerification" table only.
Verified users are “promoted” into the "users" table.




Initially → isVerified = false.
When token is confirmed → update to true (and/or move to users).
You can then safely delete the record from emailVerification.
*/