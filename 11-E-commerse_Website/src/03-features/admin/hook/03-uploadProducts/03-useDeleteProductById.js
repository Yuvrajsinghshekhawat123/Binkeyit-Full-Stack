
import { useMutation } from "@tanstack/react-query";
import { deleteProductById } from "../../api/04-uploadProducts/03-deleteProduct";

export function useDeleteProductById(){
    return useMutation({
        mutationFn:deleteProductById
    })
}

