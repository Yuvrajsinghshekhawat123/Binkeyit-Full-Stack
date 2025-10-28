import { useMutation } from "@tanstack/react-query";
import { ChangeUserPassword } from "../api/login";

export function     useChangepassword(){
    return useMutation({
        mutationFn:ChangeUserPassword
    })
}