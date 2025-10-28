import express from "express";
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
import { upload } from "../04-middlewares/multer.js";
import { AddCategoryController, deleteCategory, getAllCategory } from "../03-controllers/02-category.js";
 

export const userCategoryRouter=express.Router();
userCategoryRouter.post("/add-categories",jwtAuthMiddeware,upload.single("category_image"),AddCategoryController)
userCategoryRouter.get("/getAll-categories",getAllCategory);
userCategoryRouter.delete("/delete-categoryById/:id",jwtAuthMiddeware,deleteCategory)