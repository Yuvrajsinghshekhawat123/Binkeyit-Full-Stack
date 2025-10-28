import { useMutation } from "@tanstack/react-query";
import { deleteCategoryById } from "../../api/02-category/03-deleteCategoryById";

export function useDeleteCategoryById() {
  return useMutation({
    mutationFn: deleteCategoryById,
  });
}
