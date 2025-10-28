import { useQuery } from "@tanstack/react-query";
import { getAllSubCategories } from "../../api/03-subCategory/02-getAllSubCategory";

export function usegetAllSubCategory(){
    return useQuery({
        queryKey: ["allSubCategories"],
        queryFn: getAllSubCategories,
    })
}