import { getDB } from "../01-config/connectDB.js";

export async function updateCartProduct(userId, productId, quantity) {
  const db = getDB();

  const [existing] = await db.execute(
    `SELECT * FROM cart_product WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );

  if (existing.length > 0) {
    await db.execute(
      `UPDATE cart_product SET quantity = ? WHERE user_id = ? AND product_id = ?`,
      [quantity, userId, productId]
    );
  } else {
    await db.execute(
      `INSERT INTO cart_product (user_id, product_id, quantity) VALUES (?, ?, ?)`,
      [userId, productId, quantity]
    );
  }
}

// delete old cart send
export async function deleteOldCart(userId, cartItems) {
  const db = getDB();

  // 1️⃣ Get all product IDs currently in the user's cart
  const [existingCart] = await db.execute(
    "SELECT  product_id FROM  cart_product WHERE user_id  = ?",
    [userId]
  );

   const existingProductId = existingCart.map((item) => Number(item.product_id));
const incomingProductIds = cartItems.map((item) => Number(item.productId));


  // 2️⃣ Find products to delete (present in DB but not in incoming cart)
  const productsToDelete = existingProductId.filter(
    (id) => !incomingProductIds.includes(id)
  );

  // 3️⃣ Delete old cart items that are no longer in Redux cart
  if (productsToDelete.length > 0) {
    await db.execute(
      `DELETE FROM cart_product WHERE user_id = ? AND product_id IN (${productsToDelete.join(
        ","
      )})`,
      [userId]
    );
  }
}

export async function getAllCartProducts(userId) {
  const db = getDB();
  console.log(userId)

  const [rows] = await db.execute(`
    SELECT 
    p.id AS productId,
    p.name,
    JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0].url')) AS image, -- get first image
    p.unit,
    p.price,
    p.discount,
    c.quantity AS count
    FROM cart_product c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?;

    `,[userId]);

    return rows
}



export async function emptyCartProductTable(userID) {
    const db = getDB();
    console.log( "empty the cart",userID)
    await db.execute(`DELETE FROM cart_product where user_id=?`,[userID])
     
}