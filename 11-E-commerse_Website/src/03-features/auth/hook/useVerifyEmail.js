import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../api/register";

export function useVerifyEmail() {
    return useMutation({
        mutationFn:verifyEmail,
    });
}