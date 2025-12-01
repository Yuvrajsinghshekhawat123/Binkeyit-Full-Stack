import { useMutation } from "@tanstack/react-query";
import { sendToken } from "./02-sendToken";

export function useSendToken(){
    return useMutation({
        mutationFn:sendToken
    })
}