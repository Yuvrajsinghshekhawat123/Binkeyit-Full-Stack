 
import { getDB } from "../01-config/connectDB.js";
import cloudinary from "../06-utils/cloudinary/cloudinary.js";
 



 /*
 we add one constrinat that
 -> We make sure a sub-category name cannot repeat inside the same category.
 -> But the same sub-category name can exist under a different category.

 ✅ Allowed:
Electronics → Mobile
Clothing → Mobile

❌ Not Allowed:
Electronics → Mobile
Electronics → Mobile (again)
 



ALTER TABLE sub_categories 
ADD UNIQUE (name, categoryId);

 
 */


export async function insertOrUpdateSubCategory(id,name,ParentcategoryName, categoryId,image_url,public_id) {
    const db=getDB();



    if (id) {
    // 1. Check if subcategory already exists for the same category
    const [rows] = await db.execute(
    `SELECT id, public_id FROM sub_categories WHERE id=?`,
    [id]

    
  );

  


  if (rows.length > 0) {
     // ✅ Already exists → Update record
        const existing = rows[0];


        // 2. Delete previous image from Cloudinary (if any) only when new one is there 
        if(existing.public_id){
            try {
                await cloudinary.uploader.destroy(existing.public_id);
                console.log("Old image deleted from Cloudinary:", existing.public_id);
            } catch (err) {
                console.error("Failed to delete old image:", err.message);
            }
        }


        // 3. Update DB record with new values
        await db.execute(
      `UPDATE sub_categories 
       SET name=?, categoryName=?, image=?, public_id=? 
       WHERE id=?`,
      [name, ParentcategoryName, image_url, public_id, existing.id]
    );

    return {success:true, message: "Sub-category updated successfully"};
}
  }

 
    await db.execute(`
        insert into sub_categories (name,categoryName,categoryId,image,public_id) values (?,?,?,?,?)
    `,[name,ParentcategoryName,categoryId,image_url,public_id])


    return {success:true, message: "Sub-category inserted successfully" };



  }



export async function  getAllSubCategories(){
    const db = getDB();
    const [result]=await db.execute(`
        select * from sub_categories 
    `)
    return result
}



export async function  getSubCategoryById(id) {
     const db = getDB();
       const [result]=await db.execute(`
        select * from sub_categories  where id=?
    `,[id])
    return result
}


export async function  deleteSubCategoryById(id) {
      const db = getDB();
      
     // 1. Check if subcategory already exists for the same category
    const [rows] = await db.execute(
    `SELECT id, public_id FROM sub_categories WHERE id=?`,
    [id])


    const public_id=rows[0].public_id;
      if(!public_id){
         return { success: false, message: "No Sub Category to delete" };
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
          delete from sub_categories where id=?
        `,[id]);
        
    
        return { success: true, message: "Sub Category deleted successfully" };


}












// // get subcategory by catgegory id 

export async function getSubCategoryByCategory(categoryId) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM sub_categories WHERE categoryId=? `, [
    categoryId  ]);

  return rows;
}



