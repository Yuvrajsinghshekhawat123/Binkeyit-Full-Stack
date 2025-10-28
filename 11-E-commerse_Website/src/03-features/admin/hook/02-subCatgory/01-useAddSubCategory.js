import { useMutation } from "@tanstack/react-query";
import { addSubCategory } from "../../api/03-subCategory/01-addSubCategory";

export function useAddSubCategory() {
  return useMutation({
    mutationFn: addSubCategory,
  });
}