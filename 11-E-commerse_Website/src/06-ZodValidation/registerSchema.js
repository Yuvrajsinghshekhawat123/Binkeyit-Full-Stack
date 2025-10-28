import { z} from "zod";

export const registerSchema=z.object({
    name:z.string().min(1,"Name is required"),
    email:z.string().email("Enter a valid email"),
    password:z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
});