import { getDB } from "../01-config/connectDB.js";

export async function insertAddress(
  userId,
  address_line,
  city,
  state,
  country,
  pincode,
  mobile
) {
  const db = getDB();
  await db.execute(
    `insert into  address (user_id,address_line,city,state, country,pincode,mobile) values (?,?,?,?,?,?,?)`,
    [userId, address_line, city, state, country, pincode, mobile]
  );
}

export async function getAllAddressOfUser(userId) {
  const db = getDB();
  const [rows] = await db.execute(`select * from address where user_id=?`, [
    userId,
  ]);
  return rows;
}



// delete the address for id for particular userId
export async function deleleAddressById(addressId,userId) {
  const db = getDB();
  await db.execute(`DELETE FROM address WHERE id = ? AND user_id = ?`, [
    addressId,
    userId,
  ]);
}




    export async function getAddressById(id) {
      const db = getDB();
      const [rows] = await db.execute(`select * from address where id=?`, [
          id,
      ]);
      return rows;
    }



