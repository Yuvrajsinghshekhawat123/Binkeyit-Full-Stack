import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleleAddress } from "../api/04-deleteAddress";

 export function useDeleteAddress(){
    const queryClient = useQueryClient(); // ✅ required to invalidate queries
    return useMutation({
        mutationFn:deleleAddress,
        onSuccess: (data) => {
      // 👇 This will automatically refresh your addresses list
      queryClient.invalidateQueries(["allAddress"]);
    },

    })
 }