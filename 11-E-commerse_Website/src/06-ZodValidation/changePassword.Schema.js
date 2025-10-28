import { z } from "zod";

export const ChangePasswordSchema=z.object({
    currentPassword:z.string().min(6, "Current Password must be at least 6 characters"),
     Newpassword:z.string().min(6, "New Password must be at least 6 characters"),
    NewconfirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
})