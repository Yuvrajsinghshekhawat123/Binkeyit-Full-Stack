import { useMutation } from "@tanstack/react-query";
import { onlinePayment } from "../api/03-onlinePayment";

export function useOnlinePayment(){
    return useMutation({
        mutationFn:onlinePayment
    })
}