import { useMutation } from "@tanstack/react-query";
import { UpdateUserDetails } from "../api/login";

export function useUpdateUserDetails(){
    return useMutation({
        mutationFn:UpdateUserDetails
    });
}