import { useQuery } from "@tanstack/react-query";
import { getAllOrdersDetails } from "../api/04-getAllOrders";

export function useGetAllOrdersDetails(){
return useQuery({
    queryKey:["allOrders"],
    queryFn:getAllOrdersDetails
})
}