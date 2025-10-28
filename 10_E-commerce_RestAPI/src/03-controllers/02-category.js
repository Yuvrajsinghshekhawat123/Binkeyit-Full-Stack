import { deleteCategoryById, getAllCategories, getCategoryById, insertCategoryImageUrl } from "../02-models/04-category.js";
import { uploadImageClodinary } from "../06-utils/cloudinary/uploadImageClodinary.js";

export async function AddCategoryController(req, res) {
  try {
    const { name } = req.body;
    const category_image=req.file;

    
    if(!category_image || !name){
        return res
        .status(400)
        .json({ success: false, message: "Category name and image are required" });
    }
     

     const upload = await uploadImageClodinary(category_image,"categories");
 
     // store the url filed in db
    await insertCategoryImageUrl(name,upload.public_id, upload.url);
    return res.status(201).json({ 
        success: true, 
        message: "Category image inserted successfully",

    });
} catch (err) {
      
     return res.status(500).json({
      success: false,
      message: err.message,

     });
    }
}


export async function getAllCategory(req, res){
    try{
        const result=await getAllCategories();
        // Map through all results to structure them
            const data = result.map(cat => ({
            id: cat.id,
            name: cat.name,
            image: cat.image,   // assuming your DB column is image_url
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

export async function  deleteCategory(req,res) {
    try{

        const {id}=req.params;

        // find the reord
        const record=await getCategoryById(id);
        if(!record || record.length===0){
             return res
        .status(409)
        .json({ success: false, message: "Category not found" });
        }


        const result=await deleteCategoryById(id);
        return res.json(result);
    }catch(err){
         return res.status(500).json({
            success: false,
            message: err.message,});
    
    }
}
