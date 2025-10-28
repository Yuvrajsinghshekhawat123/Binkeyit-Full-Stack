import { useMutation,useQueryClient } from "@tanstack/react-query";
import { addAddress } from "../api/02-addAddress";

export function useAddAddress() {
    const queryClient = useQueryClient(); // ✅ required to invalidate queries
    
    return useMutation({
        mutationFn:addAddress,
        onSuccess: (data) => {
      // 👇 This will automatically refresh your addresses list
      queryClient.invalidateQueries(["allAddress"]);
    },
    })
}