import { getDB } from "../01-config/connectDB.js";
import { getAddressById } from "./02-address.js";

export async function insertDataOfCOD(
  userId,
  orderId,
  product_details,
  address,
  subTotalAmt,
  totalAmt
) {
  const db = getDB();
 
   await db.execute(
    `INSERT INTO Orders 
      (userId, orderId, product_details, payment_id, payment_status, delivery_address, subTotalAmt, totalAmt, invoice_receipt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      orderId,
      product_details,
      null, // payment_id: null for COD
      "Pending", // payment_status: Pending until delivery & cash collection
      address,
      subTotalAmt,
      totalAmt,
      null, // invoice_receipt: null for COD initially
    ]
  );
  
}


// // 4️⃣ Save tracking details inside order table
 export async function saveTrackingData(trackingNumber, shippingLabelUrl, orderId) {
  const db = getDB();

  await db.execute(
    `UPDATE orders 
     SET trackingNumber = ?, shippingLabelUrl = ?, delivery_status = 'Shipped'
     WHERE orderId = ?`,
    [trackingNumber, shippingLabelUrl, orderId]
  );
}






export async function insertDataOfOnlinePayment(userId,orderId,product_details,paymentId,paymentStatus,addressID,subTotalAmt,totalAmt) {
  const db = getDB();

   const [result] = await getAddressById(addressID);
    
 
const address = {
  address_line: result.address_line,
  city: result.city,
  state: result.state,
  country: result.country,
  pincode: result.pincode,
  mobile: result.mobile,
};



console.log(address);

   await db.execute(
    `INSERT INTO Orders 
      (userId, orderId, product_details, payment_id, payment_status, delivery_address, subTotalAmt, totalAmt, invoice_receipt,payment_method) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [
      userId,
      orderId,
      product_details,
      paymentId,
      paymentStatus , // payment_status: Pending until delivery & cash collection
       JSON.stringify(address),
      subTotalAmt,
      totalAmt,
      null, // invoice_receipt: null for COD initially
      'Online'
    ]
  );}






export async function getOrderDetailsById(userId) {
  const db = getDB();
  const [rows] = await db.execute(`
  SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC
`, [userId]);

  return rows;
}













export async function deleteOrderedProductByProductId(orderId, productId) {
  const db = getDB();

  // Step 1: Get order details
  const [orderData] = await db.execute(
    `SELECT payment_method, totalAmt FROM orders WHERE orderId = ?`,
    [orderId]
  );

  if (orderData.length === 0) {
    return { success: false, message: "Order not found" };
  }

  const paymentMethod = orderData[0].payment_method; 
  const oldTotalAmt = Number(orderData[0].totalAmt);
  const isCOD = paymentMethod === "COD";

  // Step 2: Find product index using JSON_SEARCH
  const [pathResult] = await db.execute(
    `
    SELECT JSON_SEARCH(product_details, 'one', ?, NULL, '$[*].ProductId') AS productPath
    FROM orders WHERE orderId = ?
    `,
    [productId, orderId]
  );

  const productPath = pathResult[0]?.productPath;
  if (!productPath) {
    return { success: false, message: "Product not found in order" };
  }

  const match = productPath.match(/\[(\d+)\]/);
  const index = match ? match[1] : null;

  if (index === null) {
    return { success: false, message: "Unable to locate product index" };
  }

  // Step 3: Get Price + Discount + Quantity
  const [productRow] = await db.execute(
    `
    SELECT 
      JSON_EXTRACT(product_details, '$[${index}].Price') AS Price,
      JSON_EXTRACT(product_details, '$[${index}].Discount') AS Discount,
      JSON_EXTRACT(product_details, '$[${index}].Quantity') AS Quantity
    FROM orders WHERE orderId = ?
    `,
    [orderId]
  );

  const price = Number(productRow[0].Price);
  const discount = Number(productRow[0].Discount);
  const quantity = Number(productRow[0].Quantity);

  // Apply discount
  const discountAmount = (price * discount) / 100;
  const finalPrice = price - discountAmount;

  // Total price for full quantity
  const totalReduceAmount = finalPrice * quantity;

  // Step 4: Update cancellation flags
  await db.execute(
    `
    UPDATE orders
    SET product_details = JSON_SET(
        product_details,
        '$[${index}].isCancelled', TRUE,
        '$[${index}].refundStatus', ?
    )
    WHERE orderId = ?
    `,
    [isCOD ? "Pending" : "Refunded", orderId]
  );

  // Step 5: For COD reduce final total amount
  if (isCOD) {
    const newTotal = oldTotalAmt - totalReduceAmount;

    await db.execute(
      `UPDATE orders SET totalAmt = ? WHERE orderId = ?`,
      [newTotal, orderId]
    );
  }

  // Step 6: Count active items using JSON_TABLE (FIXED)
  const [activeProducts] = await db.execute(
    `
    SELECT COUNT(*) AS activeCount
    FROM orders,
    JSON_TABLE(
      orders.product_details,
      '$[*]' COLUMNS(
        isCancelled BOOL PATH '$.isCancelled'
      )
    ) AS jt
    WHERE orders.orderId = ? AND jt.isCancelled = FALSE
    `,
    [orderId]
  );

  const activeCount = activeProducts[0].activeCount;

  // Step 7: If no active items => cancel order
  // 👉 Step 7: If no active items => cancel full order + set total to 0
 // Step 7: If no active items => cancel full order
if (activeCount === 0) {
  
  if (isCOD) {
    // COD → totals should become 0
    await db.execute(
      `
      UPDATE orders
      SET 
        delivery_status = 'Cancelled',
        payment_status = 'Pending',
        subTotalAmt = 0,
        totalAmt = 0
      WHERE orderId = ?
      `,
      [orderId]
    );

    return {
      success: true,
      message: "All products cancelled. Order cancelled successfully (COD – no refund needed)."
    };

  } else {
    // ONLINE → keep original totals, only update statuses
    await db.execute(
      `
      UPDATE orders
      SET 
        delivery_status = 'Cancelled',
        payment_status = 'Refunded'
      WHERE orderId = ?
      `,
      [orderId]
    );

    return {
      success: true,
      message: "All products cancelled. Full refund initiated and will be credited within 5–7 days."
    };
  }
}



  // Step 8: Partial cancellation message
  return {
    success: true,
    message: isCOD
      ? "This product has been cancelled (COD – no refund needed)."
      : "This product has been cancelled successfully. Refund for this item has been initiated."
  };
}
