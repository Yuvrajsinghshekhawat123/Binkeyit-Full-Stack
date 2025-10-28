import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COD } from "../api/02-COD";

export function useCOD(){
    const queryClient = useQueryClient(); // ✅ required to invalidate queries
    return useMutation({
        mutationFn:COD,
         onSuccess: (data) => {
      // 👇 This will automatically refresh your addresses list
      queryClient.invalidateQueries(["cartProducts"]);
    }
    });
}