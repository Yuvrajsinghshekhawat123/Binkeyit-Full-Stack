import { useMutation } from "@tanstack/react-query";
import { ChangeEmailVerification } from "../api/login";

export function useChangeEmailVerification(){
    return useMutation({
        mutationFn:ChangeEmailVerification
    })
}