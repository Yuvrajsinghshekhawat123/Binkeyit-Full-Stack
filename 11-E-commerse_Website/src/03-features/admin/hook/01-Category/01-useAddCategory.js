import { useMutation } from "@tanstack/react-query";
import { addCategory } from "../../api/02-category/02-add-category";

export function useAddCategory() {
  return useMutation({
    mutationFn: addCategory,
  });
}
