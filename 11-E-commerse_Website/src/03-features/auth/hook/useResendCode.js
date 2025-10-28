import { useMutation } from "@tanstack/react-query";
import { ResendCode } from "../api/register";

export function useResendCode(){
    return useMutation({
        mutationFn:ResendCode
    })
}