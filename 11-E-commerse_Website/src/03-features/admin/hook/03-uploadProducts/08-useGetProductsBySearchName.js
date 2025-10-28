import { useMutation } from "@tanstack/react-query";
import { getProductsBySearchName } from "../../api/04-uploadProducts/08-getProductBySearchName";
 

export function useGetProductsBySearchName() {
    return useMutation({
    mutationFn: getProductsBySearchName
  })
    
}
