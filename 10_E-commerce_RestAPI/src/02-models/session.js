 import {getDB} from "../01-config/connectDB.js"



// store seession 
export async function insertUserSessionRecord(userId,hashedRefreshToken,user_agent,ip) {
      const db = getDB();
    

     // Check if a row exists for this user, device, and IP
     const [row] =await db.execute(`
        select id from sessions where user_id=? and ip=? and user_agent = ?
    `,[userId,ip,user_agent]);


    if(row.length > 0){
        // ✅ Update existing row

        await db.execute(`
            update sessions set refresh_token = ?, updated_at = NOW()
             WHERE id = ?
        `,[hashedRefreshToken,row[0].id]);
    }else{
        // ➕ Insert new row

        await db.execute(`
            insert into sessions (user_id,user_agent,ip, refresh_token, created_at) values(?,?,?,?,now())
        `,[userId,user_agent,ip,hashedRefreshToken]);

    }
}



// delete the session table
export async function deleteUserSession(userId,userAgent,ip) {
     const db = getDB();
     await db.execute(`
        delete from sessions where user_id = ? and user_agent = ? and  ip=?
    `,[userId,userAgent,ip]);
}



export async function deleteUserSessionsByUserId(userId) {
     const db = getDB();
      

       await db.execute(`
        delete from sessions where user_id = ?
    `,[userId]);


}
