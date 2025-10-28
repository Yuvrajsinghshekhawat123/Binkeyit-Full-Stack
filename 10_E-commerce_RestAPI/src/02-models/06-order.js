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