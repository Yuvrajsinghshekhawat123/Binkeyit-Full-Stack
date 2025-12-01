import { useMutation } from "@tanstack/react-query";
import { deleteOrderByProductId } from "../api/06-deleteProductById";


export function useDeleteOrderByProductId(){
    return useMutation({
        mutationFn:deleteOrderByProductId
    })
}