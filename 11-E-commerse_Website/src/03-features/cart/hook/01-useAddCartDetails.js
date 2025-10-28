import { useMutation } from "@tanstack/react-query";
import { addCartDetials } from "../api/01-addCartDetails";

export function useAddCartDetials(){
    return useMutation({
        mutationFn:addCartDetials
    })
}