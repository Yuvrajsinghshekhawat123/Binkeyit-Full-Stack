 import { getDB } from "../01-config/connectDB.js";
import cloudinary from "../06-utils/cloudinary/cloudinary.js";

// insert new category with image
export async function insertCategoryImageUrl(name,publicId, url) {
  const db = getDB();
    await db.execute(
    `INSERT INTO categories (name,image, public_id) VALUES (?,?, ?)`,
    [name,url, publicId]
  );

}

export async function  getAllCategories(){
    const db = getDB();
    const [result]=await db.execute(`
        select * from categories
    `)
    return result
}

export async function  getCategoryNameById(id) {
   const db = getDB();
    const [result]=await db.execute(`
        select * from categories where id=?
    `)
    return result
}

// find category by id
export async function getCategoryById(id) {
  const db = getDB();
  const [result]=await db.execute(`
        select * from categories where id=?
    `,[id])
    return result
  
}



// delete category
export async function deleteCategoryById(id) {
  const db = getDB();
  const [result]=await db.execute(`
        select * from categories where id=?
    `,[id])

  const public_id=result[0].public_id;
  if(!public_id){
     return { success: false, message: "No Category to delete" };
  }

  // 2. Delete from Cloudinary if exists
    if(public_id){
        try{
        await cloudinary.uploader.destroy(public_id);
        console.log(`Deleted from Cloudinary: ${public_id}`);
      }catch(err){
        console.error("Cloudinary deletion error:", err);
      }

    }



    await db.execute(`
      delete from categories where id=?
    `,[id])
    

    return { success: true, message: "Category deleted successfully" };
  
}
