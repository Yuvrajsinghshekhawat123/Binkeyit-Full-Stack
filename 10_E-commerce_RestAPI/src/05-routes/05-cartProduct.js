import express from "express"
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
import { addCartProduct, getCartProducts } from "../03-controllers/05-cartProduct.js";
export const userCartproductRouter=express.Router();

userCartproductRouter.post("/addCartDetials",jwtAuthMiddeware,addCartProduct);
userCartproductRouter.get("/getCartDetials",jwtAuthMiddeware,getCartProducts);