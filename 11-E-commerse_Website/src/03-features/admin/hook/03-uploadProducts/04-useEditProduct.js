import { useMutation } from "@tanstack/react-query";
import { editProdcut } from "../../api/04-uploadProducts/04-editProduct";

export function useEditProduct(){
    return useMutation({
        mutationFn:editProdcut
    })
}