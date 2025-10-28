 
import { deleteSubCategoryById, getAllSubCategories, getSubCategoryByCategory, getSubCategoryById, insertOrUpdateSubCategory } from "../02-models/05-subCategory.js";
import { uploadImageClodinary } from "../06-utils/cloudinary/uploadImageClodinary.js";

export async function AddSubCategoryController(req, res) {
    try{

        const {subCategoryName,ParentcategoryName,categoryId ,subCategoryId}=req.body;
        const subCategory_image=req.file;
         if(!subCategoryName || !categoryId || !categoryId || !ParentcategoryName){
        return res
        .status(400)
        .json({ success: false, message: "Sub-category name, category ID and name, and image are required" });
    }


    const upload = await uploadImageClodinary(subCategory_image,"sub-categories");
    

    // insert the data to db; //     // ✅ If subCategoryId is present → update, otherwise insert
    const result=await insertOrUpdateSubCategory(  subCategoryId || null,subCategoryName,ParentcategoryName,categoryId,upload.url,upload.public_id)


     return res.status(201).json(result);


    }catch(err){
        return res.status(500).json({success: false,message: err.message,});
    }
}





export async function getAllSubCategory(req, res){
    try{
        const result=await getAllSubCategories();
        // Map through all results to structure them

 
            const data = result.map(cat => ({
            id: cat.id,
            name: cat.name,
            categoryName:cat.categoryName,
            image: cat.image,   // assuming your DB column is image_url
            categoryId: cat.categoryId,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
           }));

        return res.status(201).json({
            success: true, 
            categories:data //  // return all categories
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,});
    }
}





export async function  deleteSubCategory(req,res) {
    try{

        const {id}=req.params;

        // find the reord
        const record=await getSubCategoryById(id);
        if(!record || record.length===0){
             return res
        .status(409)
        .json({ success: false, message: "Sub Category not found" });
        }


        const result=await deleteSubCategoryById(id);
        return res.json(result);
    }catch(err){
         return res.status(500).json({
            success: false,
            message: err.message,});
    
    }
}






export async function getAllSubCategoryByCategoryId(req, res){
    try{

        const {categoryId}=req.body;
        const result=await getSubCategoryByCategory(categoryId);
        // Map through all results to structure them

 
            const data = result.map(cat => ({
            id: cat.id,
            name: cat.name,
            categoryName:cat.categoryName,
            image: cat.image,   // assuming your DB column is image_url
            categoryId: cat.categoryId,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
           }));

        return res.status(201).json({
            success: true, 
            subCategories:data //  // return all categories
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,});
    }
}