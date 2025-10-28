import axios from "axios";
 const axiosClient=axios.create({
    baseURL: "http://localhost:3000/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Important for cookies

})


axiosClient.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const status = error.response?.status;

                // ⛔ Prevent infinite loop on login page
        if (window.location.pathname === '/login') {
            return Promise.reject(error);
        }
        /*
           1.  is used to prevent an infinite redirect loop when the user is already on the login page.
            2. imagine the user is already on /login, and for some reason the request on the login page itself returns 401.
                . Without this check, the interceptor would again try to redirect to /login
                . This could cause the interceptor to keep firing repeatedly, leading to an infinite loop / refresh loop
        
        */


        // 401 → Unauthorized (redirect to login)
        if (status === 401) {
            console.log("Unauthorized, redirecting to login");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // Other errors
        return Promise.reject(error);
    }
);

export default axiosClient;


/*
2. In React (axios)

For cookies to be sent from backend → frontend, you must:
    Enable credentials in axios.
    Configure CORS on your backend to allow credentials.
Right now your axiosClient does not have withCredentials: true, so the cookies never reach the browser.






In Backend
app.use(cors({
  origin: "http://localhost:5173", // your React app URL
  credentials: true, // ✅ allow cookies
}));
*/


/*

 res.cookie("access_Token",access_Token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production", // only over HTTPS in production,
        sameSite: "strict", 
         maxAge: 20 * 60 * 1000  // 2 minutes
    });




sameSite: "strict"

With "strict", the cookie will not be sent if your frontend (http://localhost:5173) and backend (http://localhost:5000) are on different origins.

For local dev with React + Express, you usually need:

sameSite: "none",
secure: true, // must be true when sameSite is "none"

Otherwise the browser blocks cross-site cookies.

*/




/*
1. When you log in, your backend sets cookies (like access_Token, refresh_Token). These cookies live in the browser.
    But — by default, browsers do NOT send cookies on cross-origin requests (e.g. React running at http://localhost:5173 and backend at http://localhost:5000).
    That means if you just do this in React:
        axios.get("http://localhost:5000/api/user");
        👉 the browser will not attach your cookies (access_Token, refresh_Token) to the request.
            So the backend won’t know you’re logged in.

    
    ✅ Solution: Tell Axios to send cookies
        You must explicitly enable cookies when making requests:
                axios.get("http://localhost:5000/api/user", {
                        withCredentials: true,  // ⬅️ This forces cookies to be included
                });

    


Q 1 Do you need to set withCredentials: true for every request?

    1. ✅ Set withCredentials: true globally in your Axios instance.
        → That way all requests send cookies automatically.

    2.Backend will:
        Use cookies when needed (auth APIs).
        Ignore cookies when not needed (register, login, public APIs).

    No errors happen if an API doesn’t use cookies — they’re just ignored.


    Q 2 What happens if you send withCredentials: true for APIs like register or login that don’t need tokens?
        The cookies will still be sent, but backend ignores them if not required. No issue.

*/