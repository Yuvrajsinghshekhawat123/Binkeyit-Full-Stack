import { useGoogleLogin } from "@react-oauth/google";
//when we clik on login with google then this "useGoogleLogin" make the request to google and take the token then we can send that token to node js further

// useGoogleLogin() returns a functions, we store it in login // When you call login(), Google popup opens // After user logs in, onSuccess() runs

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useSendToken } from "./03-hook";

export function GoogleLoginButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: sendGoogleToken } = useSendToken();
  const [processing, setProcessing] = useState(false);

  const handleGoogleResponse = async (authResult) => {
    console.log(authResult);
    if (!authResult.code) return;

    setProcessing(true);

    sendGoogleToken(
      { code: authResult.code },
      {
        onSuccess: async (data) => {
          try {
            toast.success(data.message);
            await queryClient.invalidateQueries({ queryKey: ["userDetails"] });

            await queryClient.refetchQueries({
              queryKey: ["userDetails"],
              exact: true,
            });
             

            navigate("/", { replace: true });
          } catch (err) {
            console.error(err);
            navigate("/dashboard", { replace: true });
          }
        },
        onError: (err) => {
          toast.error("Google Login failed");
          console.error(err);
          setProcessing(false);
        },
      }
    );
  };

  /* ⭐ What does login() do? When you call: login(); It: Opens a Google login popup User chooses an account / signs in Google sends tokens onSuccess() receives tokenResponse */

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleGoogleResponse,
    onError: handleGoogleResponse,
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={processing}
      className="flex justify-center items-center gap-3 bg-red-600 hover:bg-red-700 text-white w-full font-bold rounded-lg p-2 mt-2"
    >
      {processing ? (
        <>
          <ClipLoader color="white" size={22} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5 h-5"
          />
          Login with Google
        </>
      )}
    </button>
  );
}
