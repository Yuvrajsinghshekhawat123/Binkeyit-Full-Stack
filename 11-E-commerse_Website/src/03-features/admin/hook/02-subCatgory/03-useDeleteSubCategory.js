import { useMutation } from "@tanstack/react-query";
import { deleteSubCategoryById } from "../../api/03-subCategory/03-deletesubCategory";

export function useDeleteSubCategoryById() {
  return useMutation({
    
    mutationFn: deleteSubCategoryById,
  });
}
