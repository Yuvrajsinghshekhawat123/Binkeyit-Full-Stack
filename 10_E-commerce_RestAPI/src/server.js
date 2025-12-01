import express from "express";
import { connectDB } from "./01-config/connectDB.js";
import { userAuthRouter } from "./05-routes/01-authRouters.js";
import { userCategoryRouter } from "./05-routes/02-categoryRoutes.js";
import { userSubCategoryRouter } from "./05-routes/03-subCategoryRoutes.js";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import cors from "cors"; // CORS = Cross-Origin Resource Sharing
import { userUploadProductRouter } from "./05-routes/04-uploadProduct.js";
import { userCartproductRouter } from "./05-routes/05-cartProduct.js";
import { userAddressRouter } from "./05-routes/06-Address.js";
import { userProductOrderRouter } from "./05-routes/07-order.js";
import { trackOrderRouter } from "./05-routes/08-trackOrder.js";

const  app=express();


app.use(cookieParser()); // Must come before session


// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(requestIp.mw());   // means you’re using the request-ip middleware. -- now i can call  "req.clientIp"(give ip address of user system) any where in my app 
 
async function startServer() {
    await connectDB();

    
    app.use("/api/auth",userAuthRouter);
    app.use("/api/admin",userCategoryRouter)
    app.use("/api/admin",userSubCategoryRouter)
    app.use("/api/admin",userUploadProductRouter);
    app.use("/api/cart",userCartproductRouter);
    app.use("/api/address",userAddressRouter);
    app.use("/api/order",userProductOrderRouter)
    app.use("/api/order",userProductOrderRouter)
    app.use("/api/order/fedex",trackOrderRouter);
    

    app.listen(3000,()=>{
        console.log("🚀 Server is running on port 3000");
    });
}

startServer();









/*
Browsers enforce a security policy called the Same-Origin Policy, which prevents a web page from making requests to a different domain, protocol, or port than the one that served the page.

Example:
Frontend URL	         Backend URL	              Allowed?
http://localhost:5173     http://localhost:3000     ❌ Blocked by default

Here, your frontend is on port 5173 and backend on 3000 → different origins → blocked by browser.
CORS is a mechanism that lets the server tell the browser:
“It’s okay, this origin is allowed to access my resources.”







3️⃣ Why we use CORS

Security: prevents malicious websites from calling your API.
Controlled access: lets you whitelist only trusted origins (like your frontend).
Development convenience: allows local frontend and backend to work together.




4️⃣ In practice

On backend (Node.js/Express), you enable CORS with:

import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));
On frontend, nothing special needed. Browser handles it automatically.

*/