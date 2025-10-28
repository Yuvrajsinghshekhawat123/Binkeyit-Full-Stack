import { useQuery } from "@tanstack/react-query";
import { getAllAddress } from "../api/03-getAllAddress";

export function useGetAllAddresses(){
    return useQuery({
        queryKey:['allAddress'],
        queryFn:getAllAddress
    })
}       