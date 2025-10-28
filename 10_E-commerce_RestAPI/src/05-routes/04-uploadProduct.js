import express from  "express";
import { upload } from "../04-middlewares/multer.js";
import { jwtAuthMiddeware } from "../04-middlewares/jwtAuthMiddelware.js";
import { deleteProductById, editProdcut, getAllProducts, getProductByCategory, getProductByCategoryidAndSubcategoryid, getProductByProductId, getProductsBySearchName, UploadProduct } from "../03-controllers/04-uploadProduct.js";
 



export const userUploadProductRouter=express.Router();

userUploadProductRouter.post("/add-porducts",jwtAuthMiddeware,upload.array("product_images"),UploadProduct);
userUploadProductRouter.post("/get-productsByCategoryId",getProductByCategory);
userUploadProductRouter.post("/get-productsByCategoryIdAndSubcategoryId",getProductByCategoryidAndSubcategoryid);
userUploadProductRouter.post("/get-productByProductId", getProductByProductId);
userUploadProductRouter.get("/getAll-products",getAllProducts);
userUploadProductRouter.post("/getAll-searchProducts",getProductsBySearchName);
userUploadProductRouter.delete("/delete-productByd/:id",jwtAuthMiddeware,deleteProductById);
userUploadProductRouter.put("/update-product",jwtAuthMiddeware,upload.array("new_images"),editProdcut);