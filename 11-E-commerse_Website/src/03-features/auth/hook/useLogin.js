import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginUser, LoginUserDetails } from "../api/login";


export function useLogin(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:LoginUser,
         
    });
}



export function useLoginUserDetails(){
    return useQuery({
        queryKey: ["userDetails"],
        queryFn:async ()=>{
            console.log("API call initiated"); 
            const response = await LoginUserDetails();
             return response;
        },
         
    })
}