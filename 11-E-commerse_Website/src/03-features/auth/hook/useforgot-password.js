import { useMutation } from "@tanstack/react-query";
import { ForgotPassword, ResendResetPasswordCode, ResetPassword, VerifyOTP } from "../api/login";

export  function useForgotPassword(){
    return useMutation({
        mutationFn:ForgotPassword
    })
}


export function useVerifyOTP(){
     return useMutation({
        mutationFn:VerifyOTP
    })
}
export function useResendResetPasswordCode(){
     return useMutation({
        mutationFn:ResendResetPasswordCode
    })
}



export function useResetPassword(){
     return useMutation({
        mutationFn:ResetPassword
    })
}
