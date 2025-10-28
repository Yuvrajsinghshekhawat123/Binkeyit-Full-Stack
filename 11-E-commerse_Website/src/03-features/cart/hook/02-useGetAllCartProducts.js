import {  useQuery } from "@tanstack/react-query";
import { getAllCartProducts } from "../api/02-getAllCartProducts";
 

export function useGetAllCartProduct(){
    return useQuery({
    queryKey:["cartProducts"],
    queryFn:getAllCartProducts
    })
}