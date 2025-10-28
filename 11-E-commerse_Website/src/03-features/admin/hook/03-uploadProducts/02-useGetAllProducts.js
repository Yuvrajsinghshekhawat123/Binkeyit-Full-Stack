import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../api/04-uploadProducts/02-getAllProducts";

export  function  useGetAllProducts() {
    return useQuery({
        queryKey:["allProducts"],
        queryFn:getAllProducts
    })
}