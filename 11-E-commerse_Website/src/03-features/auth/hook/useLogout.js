 import { useMutation  } from "@tanstack/react-query";
import { LogoutUser } from "../api/logout";

export function useLogout() {
    
  return useMutation({
    mutationFn: LogoutUser, // API call
  });
}


/*
✅ Why this works

useQuery → for fetching data automatically (like user details, product list).

useMutation → for actions triggered by user events (login, logout, form submit).

logout() will only run when button is clicked.

*/