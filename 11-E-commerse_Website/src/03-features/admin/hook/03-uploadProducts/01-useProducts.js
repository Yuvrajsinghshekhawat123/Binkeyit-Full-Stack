import { useMutation } from "@tanstack/react-query";
import { addproducts } from "../../api/04-uploadProducts/01-addProducts";

export function useAddProduct(){
    return useMutation({
        mutationFn:addproducts
    })
}