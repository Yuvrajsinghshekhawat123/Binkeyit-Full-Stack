
    import {getDB} from "../01-config/connectDB.js";

 import cloudinary from "../06-utils/cloudinary/cloudinary.js";



// find user by eamil
export async function findUserByEmail(email){
    const db=getDB();
    const [row]=await db.execute(`
        select * from users where email=?
    `,[email]);

    return row;
}




// find user by id
export async function findUserById(id){
    const db=getDB();
    const [row]=await db.execute(`
        select * from users where id=?
        `,[id]);
        
        return row;
    }
    
    
     export async function createGoogleUser(name, email, is_verified = true) {
  const db = getDB();

  const [result] = await db.execute(
    "INSERT INTO users (name, email, verify_email) VALUES (?, ?, ?)",
    [name, email, is_verified]
  );

  return  result.insertId;
}


// insert user detils
export async function createUser(name,email,hashedPassword,is_verified=true){
    const db=getDB();
    await db.execute(`
        insert into users (name,email,password,verify_email) values(?,?,?,?)
    `,[name,email,hashedPassword,is_verified]);

};



// update the user table
export async function updateUserEmail(id,email){
    const db=getDB();
    await db.execute(`
        update users set email=? where id=?
    `,[email, id]);
}



// change password
export async function  ChangeUserPassword(hashednewPassword,userId) {
     const db=getDB();
     await db.execute(`
        update users set password=? where id=?
    `,[hashednewPassword,userId])
}



 
 // update the avatar url
export async function insertAvatarUrl(userId,avatar_publicId, url) {
    const db = getDB();
    await db.execute(
        `UPDATE users SET avatar_public_id=?,avatar = ? WHERE id = ?`,
        [avatar_publicId,url, userId]
    );
}

// delete avatar
export async function DeleteAvatarUrl(userId) {
    const db = getDB();

     // 1. Get the avatar_public_id for this user
  const [rows] = await db.execute(
    `SELECT avatar_public_id FROM users WHERE id = ?`,
    [userId]
  );



  const publicId = rows[0].avatar_public_id;

  // 2. If no avatar, just exit
  if (!publicId) {
    return { success: false, message: "No avatar to delete" };
  }

  // 2. Delete from Cloudinary if exists
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted from Cloudinary: ${publicId}`);
    } catch (err) {
      console.error("Cloudinary deletion error:", err);
    }
  }


    await db.execute(
        `UPDATE users SET avatar_public_id=null,avatar = null WHERE id = ?`,
        [userId]
    );


     return { success: true, message: "Avatar deleted successfully" };
}


export async function getAvatarPublicId(userId){
            const db = getDB();
        const [rows] = await db.execute(
            `SELECT avatar_public_id FROM users WHERE id = ?`,
            [userId]
            );
        
            if (rows.length === 0) {
                return null; // user not found
            }

             return rows[0].avatar_public_id; // may be null if no avatar
}


export async function  updateProfile(name,mobile,userId) {
    const db = getDB();
    await db.execute(`
        update users set name=?, mobile=? WHERE id=?
    `,[name,mobile,userId]);
}


// update password
export async function  updateUserPassword(email,hashednewPassword) {
    const db = getDB();
    await db.execute(`
        update users set password=? WHERE email=?
    `,[hashednewPassword,email]);;
}



// update last_login_date for a specific user,
export async function updateUserById(userId) {
    const db = getDB();
    const last_login_date= new Date(); // current timestamp
    await db.execute(`
         UPDATE users
            SET last_login_date=?
            WHERE id = ?;

    `,[last_login_date,userId]);;
}