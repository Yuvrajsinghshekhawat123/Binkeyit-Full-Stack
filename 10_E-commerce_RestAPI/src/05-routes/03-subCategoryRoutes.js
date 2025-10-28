import express from  "express";

import { AddSubCategoryController, deleteSubCategory, getAllSubCategory, getAllSubCategoryByCategoryId } from "../03-controllers/03-subCategory.js";
import { upload } from "../04-middlewares/multer.js";
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
 



export const userSubCategoryRouter=express.Router();

userSubCategoryRouter.post("/add-subcategories",jwtAuthMiddeware,upload.single("sub-category_image"),AddSubCategoryController);
userSubCategoryRouter.get("/getAll-subcategories" ,getAllSubCategory);
userSubCategoryRouter.post("/getAll-subcategoriesByCategoryId" ,getAllSubCategoryByCategoryId);
userSubCategoryRouter.delete("/delete-subcategoryById/:id",jwtAuthMiddeware,deleteSubCategory);




 