import { useMutation } from "@tanstack/react-query";
import { getProductsByCategory } from "../../api/04-uploadProducts/05-getProductsByCategoryId";

export function useGetProductsByCategory(){
    return useMutation({
        mutationFn:(id) => getProductsByCategory(id)
    })
}