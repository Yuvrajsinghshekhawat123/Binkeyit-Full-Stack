import express from "express";
import { ChangePassword, DeleteAvatar, forgotPassword, LoginUser, LoginUserDetails, logout, registerUser, ResendCode, ResendResetPasswordCode, resetPassword, updateUserDetails, uploadAvatar, verifiyEmail, verify_Reset_Password_OTP, verifyEmailChange } from "../03-controllers/01-users.js";
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
import { upload } from "../04-middlewares/multer.js";
 
 
export const userAuthRouter=express.Router();
    
// routes
userAuthRouter.post("/register", registerUser);  // saves user, creates email_verification row
userAuthRouter.post("/verify-email", verifiyEmail);  // checks code, marks verified
userAuthRouter.post("/resend-Code",ResendCode);

userAuthRouter.post("/login",LoginUser);



userAuthRouter.get("/userDetails",jwtAuthMiddeware,LoginUserDetails)
userAuthRouter.get("/logout",jwtAuthMiddeware,logout);

userAuthRouter.put('/upload-avatar',jwtAuthMiddeware,upload.single("avatar"),uploadAvatar)
userAuthRouter.delete("/delete-avatar",jwtAuthMiddeware,DeleteAvatar)
userAuthRouter.put('/update-profile',jwtAuthMiddeware, updateUserDetails)
userAuthRouter.post("/verifyEmailChange",jwtAuthMiddeware,verifyEmailChange)
/*
If the user does not upload a new avatar, then:
    req.file will be undefined
    Your backend should check if req.file exists before updating the DB

*/


userAuthRouter.post("/change-password",jwtAuthMiddeware,ChangePassword)


userAuthRouter.post('/forgot-password',forgotPassword);

userAuthRouter.post('/verify-otp',verify_Reset_Password_OTP);
userAuthRouter.post("/resend-reset-password-otp",ResendResetPasswordCode)
userAuthRouter.post("/resetPassword",resetPassword);