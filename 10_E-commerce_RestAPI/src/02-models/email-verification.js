import {getDB} from "../01-config/connectDB.js"


// insert user detils
 export async function insertEmailVerification( name, email, passwordHash, token) {
    const db=getDB();
    const expiresAt=new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
  await db.execute(
    `INSERT INTO emailVerification (name, email, passwordHash, token, expiresAt)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE passwordHash=?, token=?, expiresAt=?`,
    [name, email, passwordHash, token, expiresAt, passwordHash, token, expiresAt]
  );
}


// find eamil
export async function findVerificationByEmail(email){
    const db=getDB();
    const [row] = await db.execute(`
        select * from emailVerification  where email=?
    `,[email]);

    return row; // row--> is filed and row is array

    //[rows, fields] 

}



// // mark email as verified
export async function  markVerified(email){
    const db=getDB();
    await db.execute(`
        update emailVerification  set isVerified=1 where email=?
    `,[email]);
}



 // 6. Clean up verification row
export async function deleteVerification(email) {
    const db = getDB();
    await db.execute(
        `DELETE FROM emailVerification WHERE email=?`,
        [email]
    );
}
