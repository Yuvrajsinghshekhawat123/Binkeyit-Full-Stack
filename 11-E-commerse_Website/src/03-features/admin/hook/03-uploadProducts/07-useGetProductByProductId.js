import { useMutation } from "@tanstack/react-query";
import { getProductByProductId } from "../../api/04-uploadProducts/07-getProductById";
 
 

export function useGetProductByProductId() {
  return useMutation({
    mutationFn: getProductByProductId
  })
}
