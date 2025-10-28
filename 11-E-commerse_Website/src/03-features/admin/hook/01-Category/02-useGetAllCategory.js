import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../api/02-category/01-getAllCategories";

export function usegetAllCategories() {
  return useQuery({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
  });
}
