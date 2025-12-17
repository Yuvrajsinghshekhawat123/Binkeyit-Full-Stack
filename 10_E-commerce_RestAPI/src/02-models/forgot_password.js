import { getDB } from "../01-config/connectDB.js";

export async function savePasswordVerificationToken(userId,token) {
    const db=getDB();
    const expiresAt=new Date(Date.now() + 5 * 60 * 1000) // 5 min

    await db.execute(`
        insert into forgot_password (user_id,otp,expires_at) values(?,?,?)
        on duplicate key update otp=values(otp) , expires_at=values(expires_at)
    `,[userId,token,expiresAt])
}


 //  Clean up verification row

export async function deleteOtpWhenError(userId) {
    const db = getDB();
    await db.execute(
        `DELETE FROM forgot_password WHERE user_id=?`,
        [userId]
    );
}
// get data
export async function findResetPasswordUser(userId) {
    const db = getDB();
    const [row]=await db.execute(`
        select otp , expires_at from forgot_password where user_id=?
    `,[userId])

    return row;
}