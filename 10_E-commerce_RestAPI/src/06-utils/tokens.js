import jwt from "jsonwebtoken";


export  function setAccessTokenCookies(res,payload) {
    const access_Token=jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1m"});

    res.cookie("access_Token",access_Token,{
        httpOnly:true,
           secure: process.env.NODE_ENV === "production", // ✅ required
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
         maxAge: 5* 60 * 1000  // 5 minutes
    });

    return access_Token;
};




export  function setRefreshTokenCookie(res,payload) {
    const  refresh_Token=jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:"20h"}); // token validity in JWT

    res.cookie("refresh_Token", refresh_Token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
         maxAge:  24 * 60 * 60 * 1000 // 1 day in ms  , Cookie expires in 24h , JWT itself expires in 20h
    });

    return  refresh_Token;
};



/*

sameSite: "strict"

With "strict", the cookie will not be sent if your frontend (http://localhost:5173) and backend (http://localhost:5000) are on different origins.
For local dev with React + Express, you usually need:

sameSite: "none",
secure: true, // must be true when sameSite is "none"
Otherwise the browser blocks cross-site cookies.



✅ Best practice:

Dev: sameSite: "Lax", secure: false (no HTTPS).

Prod: sameSite: "None", secure: true (with HTTPS).
*/