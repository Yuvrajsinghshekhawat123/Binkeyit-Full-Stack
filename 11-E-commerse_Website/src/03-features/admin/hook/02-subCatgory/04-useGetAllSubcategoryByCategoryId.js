import { useMutation } from "@tanstack/react-query";
import { getAllSubCategoriesByCategoryId } from "../../api/03-subCategory/04-getAllSubcategoryByCategoryId";

 export function useGetAllSubcategoryByCategoryId(){
    return useMutation({
        mutationFn:getAllSubCategoriesByCategoryId
    })
 }