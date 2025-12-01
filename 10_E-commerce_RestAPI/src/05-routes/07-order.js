import express from "express"
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
import { COD, deleteOrder, getOrderDetails, onlinePayment, webhookStripe } from "../03-controllers/07-order.js";
export const userProductOrderRouter=express.Router();

userProductOrderRouter.post("/cod",jwtAuthMiddeware,COD);
userProductOrderRouter.post("/checkout",jwtAuthMiddeware,onlinePayment);
userProductOrderRouter.post("/webhook",webhookStripe)
userProductOrderRouter.get("/getOrders",jwtAuthMiddeware,getOrderDetails)

userProductOrderRouter.post("/deleteProduct",jwtAuthMiddeware,deleteOrder)