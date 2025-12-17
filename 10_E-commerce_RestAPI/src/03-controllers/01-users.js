import argon2 from "argon2";
import {
  ChangeUserPassword,
  createGoogleUser,
  createUser,
  DeleteAvatarUrl,
  findUserByEmail,
  findUserById,
  getAvatarPublicId,
  insertAvatarUrl,
  updateProfile,
  updateUserById,
  updateUserEmail,
  updateUserPassword,
} from "../02-models/01-users.js";
import { sendVerificationCode } from "../07-ResendApi/emailVerification/sendVerificationCode.js";
import crypto from "crypto";
import {
  deleteVerification,
  findVerificationByEmail,
  insertEmailVerification,
  markVerified,
} from "../02-models/email-verification.js";

import {
  setAccessTokenCookies,
  setRefreshTokenCookie,
} from "../06-utils/tokens.js";
import {
  deleteUserSession,
  insertUserSessionRecord,
} from "../02-models/session.js";

import { uploadImageClodinary } from "../06-utils/cloudinary/uploadImageClodinary.js";
import {
  deleteOtpWhenError,
  findResetPasswordUser,
  savePasswordVerificationToken,
} from "../02-models/forgot_password.js";
import { sendResetPasswordVerificationCode } from "../07-ResendApi/resetPassword/sendResetPasswordVerificationCode.js";
import cloudinary from "../06-utils/cloudinary/cloudinary.js";
import { oauth2client } from "../06-utils/googleConfig.js";
import { google } from "googleapis";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);
    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser.length !== 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await argon2.hash(password);

    //3.  generate a 6 digit token
    const token = crypto.randomInt(100000, 999999).toString();
    const hashedToken = await argon2.hash(token);

    // 4. Save to emailVerification table
    await insertEmailVerification(name, email, hashedPassword, hashedToken);

    // send verification on eamil
    // this will trigger the verification process
    const emailResult = await sendVerificationCode(name, email, token);
    if (!emailResult.success) {
      await deleteVerification(email); // delete the row
      return res
        .status(500)
        .json({ success: false, message: emailResult.message });
    }

    // 6. Respond
    res
      .status(201)
      .json({ success: true, message: emailResult.message, hi: "hi" });
  } catch (err) {
    console.error("Registration Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Registration failed" });
  }
}

/*
🔹 Flow
1. User signs up →" POST /register"
    Stores user info + hashed token in emailVerification table.
    Sends a 6-digit code to user’s email.

2. User receives code → enters it in frontend form (like: Enter 6-digit code).
3. Frontend calls your verify route → "POST /verify-email"
    Payload: { email, code }
    Backend checks against emailVerification table.
    If valid: mark isVerified = true and move data to users table.
    If invalid/expired: reject.

*/

export async function verifiyEmail(req, res) {
  try {
    const { email, code } = req.body;

    // 1. find verification record
    const record = await findVerificationByEmail(email);
    if (!record || record.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verification record not found" });
    }

    // check if token is expired or not
    const now = Date.now();
    if (!record[0].expiresAt || new Date(record[0].expiresAt).getTime() < now) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code expired" });
    }

    // 2. Compare token
    const isMatch = await argon2.verify(record[0].token, code);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // 3. Mark verified
    await markVerified(email);

    // 4. Move user from verification table -> users table
    await createUser(record[0].name, record[0].email, record[0].passwordHash);

    //  // 6. Clean up verification row
    await deleteVerification(email);
    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify Email Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
}

export async function ResendCode(req, res) {
  try {
    const { name, email } = req.body;
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name or email is missing or invalid",
      });
    }

    // 1. find verification record
    const record = await findVerificationByEmail(email);
    if (!record || record.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verification record not found" });
    }


      
    //3.  generate a 6 digit token
    const token = crypto.randomInt(100000, 999999).toString();
    const hashedToken = await argon2.hash(token);

    // 4. Save to emailVerification table
    await insertEmailVerification(
      name,
      email,
      record[0].passwordHash,
      hashedToken
    );

    // send verification on eamil
    // this will trigger the verification process
    const emailResult = await sendVerificationCode(name, email, token);
    if (!emailResult.success) {
      await deleteVerification(email); // delete the row
      return res
        .status(500)
        .json({ success: false, message: emailResult.message });
    }

    // 6. Respond
    res
      .status(201)
      .json({ success: true, message: emailResult.message, hi: "hi" });
  } catch (err) {
    console.error("Registration Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Resending code filed" });
  }
}

// login the user

 export async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser.length === 0) {
      return res.status(409).json({ success: false, message: "User not found" });
    }

    const user = existingUser[0];

    // ===============================
    // ⭐ SITUATION 1 — Google Signup → Manual Login Later
    // password is NULL
    // ===============================
    if (user.password === null) {
      return res.status(400).json({
        success: false,
        message: "You signed up using Google. Please login with Google.",
      });
    }

    // Normal manual login
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(404).json({ success: false, message: "Invalid password" });
    }

    const access_Token = setAccessTokenCookies(res, { userId: user.id });
    const refresh_Token = setRefreshTokenCookie(res, { userId: user.id });

    const hashedRefreshToken = await argon2.hash(refresh_Token);
    const userAgent = req.headers["user-agent"] || null;

    await insertUserSessionRecord(
      user.id,
      hashedRefreshToken,
      userAgent,
      req.clientIp
    );
    await updateUserById(user.id);

    res.status(200).json({ success: true, message: "User login successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


// Login user Details for profile
export async function LoginUserDetails(req, res) {
  try {
    const user = await findUserById(req.userId);
    if (user.length === 0)
      return res
        .status(409)
        .json({ success: false, message: "User not found" });
    // Pick only necessary fields
    const filteredUser = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      avatar: user[0].avatar,
      mobile: user[0].mobile,
      verify_email: user[0].verify_email,
      last_login_date: user[0].last_login_date,
      status: user[0].status,
      role: user[0].role,
      created_at: user[0].created_at,
    };

    return res
      .status(200)
      .json({ success: true, message: "User details", data: filteredUser }); // return single user object
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// logout
export async function logout(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || null;
    await deleteUserSession(req.userId, userAgent, req.clientIp);

    res.clearCookie("access_Token"); // remove JWT from cookie
    res.clearCookie("refresh_Token"); // remove JWT from cookie
    res.status(201).json({ success: true, message: "User logut successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// upload user avatar
export async function uploadAvatar(req, res) {
  try {
    const image = req.file;
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // before uploading the new one delete the previous one
    // 1. Get the old avatar_public_id before overwriting
    const oldPublicId = await getAvatarPublicId(req.userId);

    const upload = await uploadImageClodinary(image);

    // store the url filed in db
    await insertAvatarUrl(req.userId, upload.public_id, upload.url);

    // 4. Delete the old avatar only after DB update succeeds
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`Deleted old avatar: ${oldPublicId}`);
      } catch (err) {
        console.error("Failed to delete old avatar:", err);
      }
    }

    

    return res.status(201).json({
      success: true,
      data: { userId: req.userId, avatar: upload.url },
      message: "file upload Successfully",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function DeleteAvatar(req, res) {
  try {
    const user = await findUserById(req.userId);
    if (user.length === 0)
      return res
        .status(409)
        .json({ success: false, message: "User not found" });

    const result = await DeleteAvatarUrl(req.userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// change password
export async function ChangePassword(req, res) {
  try {
    const { currentPassword, NewPassword } = req.body;

    const user = await findUserById(req.userId);
    if (user.length === 0)
      return res.status(404).json({
        success: false,
        message: "User not found for change  password",
      });

    const isMatch = await argon2.verify(user[0].password, currentPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Current password enter" });
    }

    // hash new  password
    const hashNewPassword = await argon2.hash(NewPassword);

    // store in db
    await ChangeUserPassword(hashNewPassword, req.userId);

    res
      .status(201)
      .json({ success: true, message: "Password change success fully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const { name, email, mobile } = req.body;

    const user = await findUserById(req.userId);
    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    const oldUser = user[0];

    // update only changed fileds
    const updatedUser = {
      name: name || oldUser.name,
      mobile: mobile || oldUser.mobile,
    };

    // 1️⃣ Always update non-email fields immediately
    await updateProfile(updatedUser.name, updatedUser.mobile, req.userId);

    // 2️⃣ Only handle email separately
    // check if email is changed
    if (email && email !== oldUser.email) {
      const token = crypto.randomInt(100000, 999999).toString();
      const hashedToken = await argon2.hash(token);
      await insertEmailVerification(
        updatedUser.name,
        email,
        oldUser.password,
        hashedToken
      );

      const emailResult = await sendVerificationCode(
        updatedUser.name,
        email,
        token
      );
      if (!emailResult.success) {
        await deleteVerification(email);
        return res
          .status(500)
          .json({ success: false, message: emailResult.message });
      }

      // 6. Respond
      return res
        .status(200)
        .json({ success: true, message: emailResult.message });
    } else if (email === oldUser.email) {
      res.status(400).json({
        success: true,
        message: "Email should not be same, change email should be differnt",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      let errorMessage;
      if (err.sqlMessage.includes("users.email")) {
        errorMessage = "This email is already registered with another account.";
      } else {
        errorMessage = "Duplicate value found.";
      }

      return res.status(409).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: err.message });
  }
}

// verify email change
export async function verifyEmailChange(req, res) {
  try {
    const { email, code } = req.body; // ✅ use code, not token
    console.log(email);

    const record = await findVerificationByEmail(email);
    if (!record || record.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verification record not found" });
    }

    // 1. Check if expired
    const now = new Date();
    if (!record[0].expiresAt || new Date(record[0].expiresAt).getTime() < now) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code expired" });
    }

    // 2. Verify code
    const isMatch = await argon2.verify(record[0].token, code);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // 3. Mark verified
    await markVerified(email);

    // 4. Update only email
    await updateUserEmail(req.userId, email);

    // 5. Delete verification record
    await deleteVerification(email);

    res
      .status(201)
      .json({ success: true, message: "Email updated successfully" });
  } catch (err) {
    console.error("Verify Email Change Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
}

/*
🔑 Forgot Password Flow (REST API)
    1. User clicks "Forgot Password" → enters email
        . API: POST /auth/forgot-password
        . Request: { email }
        . Backend checks if email exists in users table.
        . If exists → generate a 6-digit OTP (or random token).
        . Save OTP in forgot_password_otp column with expiry time (e.g., 10 minutes).
        . Send OTP to user’s email.
        . Response: "OTP sent to your email"


    2. User enters OTP (Verification Step)
        .API: POST /auth/verify-otp
        .Request: { email, otp }
        .Backend: check if forgot_password_otp matches and not expired.
        .If valid → mark user as verified for password reset.
        .Response: "OTP verified, you can reset password now"


    User sets New Password

    3. API: POST /auth/reset-password
        .Request: { email, newPassword }
        .Backend:
            .Hash new password.
            .Update users.password in DB.
            .Clear forgot_password_otp.
        .Response: "Password reset successful"

*/

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // 1. check if exits  in users table
    const existingUser = await findUserByEmail(email);
    if (existingUser.length === 0)
      return res
        .status(409)
        .json({ success: false, message: "User not found" });

    const user = existingUser[0];

    // 2. user exits now , send 6 digit otp
    const token = crypto.randomInt(100000, 999999).toString();
    const hashedToken = await argon2.hash(token);

    // 3. save otp in forgot_password table
    await savePasswordVerificationToken(user.id, hashedToken);

    const emailResult = await sendResetPasswordVerificationCode(
      user.name,
      email,
      token
    );
    if (!emailResult.success) {
      await deleteOtpWhenError(user.id);
      return res
        .status(500)
        .json({ success: false, message: emailResult.message });
    }

    // 6. Respond
    return res
      .status(200)
      .json({ success: true, message: emailResult.message });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function verify_Reset_Password_OTP(req, res) {
  try {
    const { email, code } = req.body;
    console.log(email);
    if (!email || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const ResetPasswordUserDetail = await findResetPasswordUser(
      existingUser[0].id
    );

    if (ResetPasswordUserDetail.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No reset request found" });
    }

    // check if token is expired or not
    const now = Date.now();
    const { otp, expires_at } = ResetPasswordUserDetail[0];
    if (!expires_at || new Date(expires_at).getTime() < now) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code expired" });
    }

    const isMatch = await argon2.verify(otp, code);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    //clen resours
    await deleteOtpWhenError(existingUser[0].id);
    // success → allow reset
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
}

// resend ResetPassword code
export async function ResendResetPasswordCode(req, res) {
  try {
    const { email } = req.body;

    console.log(email);
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is missing or invalid" });
    }

    // 1. find verification record
    const record = await findUserByEmail(email);
    if (!record || record.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Email is missing or invalid" });
    }

    const user = record[0];

    //3.  generate a 6 digit token
    const token = crypto.randomInt(100000, 999999).toString();
    const hashedToken = await argon2.hash(token);

    // 3. save otp in forgot_password table
    await savePasswordVerificationToken(user.id, hashedToken);

    // send verification on eamil
    // this will trigger the verification process
    const emailResult = await sendResetPasswordVerificationCode(
      user.name,
      email,
      token
    );
    if (!emailResult.success) {
      await deleteOtpWhenError(user.id);
      return res
        .status(500)
        .json({ success: false, message: emailResult.message });
    }

    // 6. Respond
    return res
      .status(200)
      .json({ success: true, message: emailResult.message });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    console.log(existingUser);
    if (existingUser.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const hashednewPassword = await argon2.hash(password);

    //update the password for enter email
    await updateUserPassword(email, hashednewPassword);

    console.log(existingUser);
    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}















 // google login
export async function googleLogin(req, res) {
  try {
    const { code } = req.body;

    // 1. Exchange code -> tokens
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    

    // 2. Get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const { email, name, picture } = data;

    // 3. Check existing user
    const result = await findUserByEmail(email);

    // ==============================
    // ⭐ SITUATION 4 — DIFFERENT email (completely new user)
    // If no user found → create new Google user
    // ==============================
    if (result.length === 0) {
      const newUserId = await createGoogleUser(
        name,
        email,
      );

      // generate tokens
      const access_Token = setAccessTokenCookies(res, { userId: newUserId });
      const refresh_Token = setRefreshTokenCookie(res, { userId: newUserId });

      // store refresh token
      const hashedRefreshToken = await argon2.hash(refresh_Token);
      const userAgent = req.headers["user-agent"] || null;

      await insertUserSessionRecord(
        newUserId,
        hashedRefreshToken,
        userAgent,
        req.clientIp
      );

      return res.status(200).json({
        success: true,
        message: "Google user created & logged in",
      });
    }

    const user = result[0];

    // ============================
    // ⭐ SITUATION 2 — Manual Signup → Google Login Later
    // password NOT NULL, email matches
    // allow login
    // ============================
    // DO NOTHING SPECIAL (just login same account)

    // 5. Login same user
    const access_Token = setAccessTokenCookies(res, { userId: user.id });
    const refresh_Token = setRefreshTokenCookie(res, { userId: user.id });

    const hashedRefreshToken = await argon2.hash(refresh_Token);
    const userAgent = req.headers["user-agent"] || null;

    await insertUserSessionRecord(
      user.id,
      hashedRefreshToken,
      userAgent,
      req.clientIp
    );

    return res.json({
      success: true,
      message: "Google login successful",
    });

  } catch (err) {
    console.error("Google Login Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Google login failed" });
  }
}
