import { useMutation } from "@tanstack/react-query";
import { getProductsByCategoryAndSubcategory } from "../../api/04-uploadProducts/06-getProductsByCategoryIdAndSubCategoryId";

export function useGetProductsByCategoryIdAndSubCategoryId(){
    return useMutation({
        
        mutationFn:getProductsByCategoryAndSubcategory
    })
}