 
import { getDB } from "../01-config/connectDB.js";
import cloudinary from "../06-utils/cloudinary/cloudinary.js";

export async function insertProductDetails(
  name,
  subCategoryName,
  ParentcategoryName,
  images,
  categoryId,
  SubcategoryId,
  unit,
  stock,
  price,
  discount,
  description,
  moreDetails,
  fields
) {
  const db = getDB();

  await db.execute(
    `
         insert into products (name,subCategoryName,CategoryName,images,categoryId,sub_categoryId,unit,stock,price,discount,description ,more_details,fields) values(?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      name,
      subCategoryName,
      ParentcategoryName,
      images,
      categoryId,
      SubcategoryId,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
      fields,
    ]
  );
}

export async function getAllProductsFromDB() {
  const db = getDB();
  const [result] = await db.execute(`
        select * from products
    `);
  return result;
}

export async function getProductById(id) {
  const db = getDB();
  const [result] = await db.execute(
    `
        select * from products where id=?
    `,
    [id]
  );
  return result;
}

// delete record
export async function deleteProduct(id) {
  const db = getDB();
  const [rows] = await db.execute(
    `SELECT id, images FROM products WHERE id=?`,
    [id]
  );

  if (!rows.length) {
    return { success: false, message: "Product not found" };
  }

  // images already an array of objects (thanks to MySQL JSON type)
  const images = rows[0].images || [];

  const public_ids = images.map((img) => img.publicId);

  if (public_ids.length > 0) {
    try {
      await Promise.all(
        public_ids.map((public_id) => cloudinary.uploader.destroy(public_id))
      );
      console.log("Deleted from Cloudinary:", public_ids);
    } catch (err) {
      console.error("Cloudinary deletion error:", err);
      return {
        success: false,
        message: "Products not deleted from cloudinary",
      };
    }
  }

  await db.execute(`DELETE FROM products WHERE id=?`, [id]);

  return { success: true, message: "Product deleted successfully" };
}

//update the product

export async function updateMainProductInfo(
  id,
  name,
  CategoryName,
  subCategoryName,
  unit,
  stock,
  price,
  discount,
  description,
  more_details,
  fields
) {
  const db = getDB();
  // 2️⃣ Update main product info
  await db.query(
    `UPDATE products SET 
         name=?,CategoryName=?,subCategoryName=?,unit=?,stock=?,price=?,discount=?,description=? ,more_details=?,fields=?
      WHERE id=?`,
    [
      name,
      CategoryName,
      subCategoryName,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      fields,
      id,
    ]
  );
}

// delete image from cloudinay
export async function deleteImageFromCloudinaryAndDB(id, public_id) {
  if (public_id) {
    try {
      await cloudinary.uploader.destroy(public_id);
      console.log(`Deleted from Cloudinary: ${public_id}`);
    } catch (err) {
      console.error("Cloudinary deletion error:", err);
    }
  }

  const db = getDB();
  const [rows] = await db.execute(`SELECT images FROM products WHERE id=?`, [
    id,
  ]);

  const images = rows[0].images;
  const updatedImages = images.filter((img) => img.publicId !== public_id);

  await db.query("UPDATE products SET images = ? WHERE id = ?", [
    JSON.stringify(updatedImages),
    id,
  ]);
}

// insert new images with old images

export async function insertNewImagesWithOld(id, newImages) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT images FROM products WHERE id=?`, [
    id,
  ]);

  const images = rows[0].images;
  const addNewImages = [...images, ...newImages];

  await db.query("UPDATE products SET images = ? WHERE id = ?", [
    JSON.stringify(addNewImages),
    id,
  ]);
}


// get products by catgegory id
export async function getProductsByCategoryId(categoryId) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM products WHERE categoryId=? `, [
    categoryId,
  ]);

  return rows;
}








// // get products by catgegory id and subCatgory id 

export async function getProductsByCategoryAndSubCategory(categoryId,subCategoryId) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM products WHERE categoryId=? and sub_categoryId=? `, [
    categoryId,subCategoryId
  ]);

  return rows;
}





export async function  searchProducts(q, limit = 10, page = 1) {
  const db = getDB();

    const limitNum = Number(limit);
  const offset = (Number(page) - 1) * limitNum;


  // 🧠 Query with placeholders (safe from SQL injection)
  const [rows] = await db.query(
    `
    SELECT * FROM products
    WHERE name LIKE ? 
    LIMIT ? OFFSET ?
    `,
    [`%${q}%`, limitNum, offset]
  );
  return rows;
}




/*
⚙️ Difference Between .execute() and .query() in mysql2
🧩 .execute()

Uses prepared statements (MySQL prepares the SQL before executing).

Every ? placeholder is strictly type-checked.

Does not allow placeholders in structural positions (like LIMIT, OFFSET, ORDER BY, or column names).

Best for queries that run often with different values — great for performance and security.


.query()

Runs the SQL directly (no prepared statement).

Still sanitizes inputs when using ? placeholders.

Allows placeholders for LIMIT, OFFSET, etc.

Slightly less performant for many repeated calls, but safe and flexible for general use.




*/


 


/*
You pass	         SQL becomes	          Matches
[q, q]    	       LIKE 'soap'	          only exact match "soap"
[%${q}%, %${q}%]	 LIKE '%soap%'	        any text containing "soap"




% is a wildcard in SQL’s LIKE operator —
it means “match anything (zero or more characters).”


LIKE = search pattern match
% = wildcard for “any number of characters”
%${q}% = find anything that contains the search term
Using ? = secure parameterized query


To match products containing the word "soap",
you must wrap it with % wildcards:
  [`%${q}%`, `%${q}%`]

 
*/