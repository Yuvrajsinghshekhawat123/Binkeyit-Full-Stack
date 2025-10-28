import express from "express";
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
import { AddAddress, deleleAddress, getAllAddress } from "../03-controllers/06-addAddress.js";
export const userAddressRouter=express.Router();


userAddressRouter.post("/addAddress",jwtAuthMiddeware,AddAddress);
userAddressRouter.get("/getAllAddress",jwtAuthMiddeware,getAllAddress);
userAddressRouter.post("/deleteAddressbyId",jwtAuthMiddeware,deleleAddress);