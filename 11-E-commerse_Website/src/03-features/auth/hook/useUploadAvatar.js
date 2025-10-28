import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "../api/login";

export function useUploadAvatar(){
    return useMutation({
        mutationFn:uploadAvatar
    })
}