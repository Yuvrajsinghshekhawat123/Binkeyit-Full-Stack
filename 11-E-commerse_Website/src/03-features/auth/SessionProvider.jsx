 import { useDispatch } from "react-redux";
import { useLoginUserDetails } from "./hook/useLogin";
import { useEffect, useState } from "react";
import { clearUserDetails, setUserDetails } from "../../00-app/01-userSlice";
import { ClipLoader } from "react-spinners";

export function SessionProvider({ children }) {
  const dispatch = useDispatch();
  const { data: user, isLoading, isError } = useLoginUserDetails();

  // ✅ Show loader for minimum time to prevent flickering
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      dispatch(clearUserDetails());
    } else if (user) {
      dispatch(setUserDetails(user.data));
    }
  }, [isLoading, isError, user, dispatch]);


  

 // We use a small delay (300ms) before hiding the loader to:
// 1. Ensure queries finish updating Redux before UI switches (prevents race condition)
// 2. Avoid flickering if the loading state changes too quickly
// 3. Provide a smoother user experience

useEffect(() => {
  let timer;

  if (isLoading) {
    // Show loader immediately when a request starts
    setShowLoader(true);
  } else {
    // Keep loader visible for at least 300ms before hiding , so that the redex is update before channging the routes
    timer = setTimeout(() => setShowLoader(false), 300);
  }

  return () => clearTimeout(timer);
}, [isLoading]);


  // ✅ Show loader only when loading OR during minimum time
  if (isLoading || showLoader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#2563eb" loading size={40} />
      </div>
    );
  }

  return children;
}