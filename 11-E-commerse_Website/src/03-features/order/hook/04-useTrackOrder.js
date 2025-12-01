import { useMutation } from "@tanstack/react-query";
import { fedexTrackOrder } from "../api/05-trackOrder";

export function useFedexTrackOrder(){
    return useMutation({
        mutationFn:fedexTrackOrder
    })
}