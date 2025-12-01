import express from "express";
import { Router } from "express";
import { fedexTrackingOrder } from "../03-controllers/08-fedexTrackingOrder.js";

export const trackOrderRouter=Router();

trackOrderRouter.post("/track",fedexTrackingOrder);
 

