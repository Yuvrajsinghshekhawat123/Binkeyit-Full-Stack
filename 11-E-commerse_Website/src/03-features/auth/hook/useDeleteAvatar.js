import { useMutation } from "@tanstack/react-query";
import { DeleteAvatar } from "../api/login";

export function useDeleteAvatar(){
    return useMutation({
        mutationFn:DeleteAvatar
    })
}