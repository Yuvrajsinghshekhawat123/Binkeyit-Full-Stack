import {google} from "googleapis";
const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET;


 export const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
);



/*
1️⃣ User clicks “Login with Google” on frontend
    Google sends your frontend a short-lived authorization code (NOT the real token).


2️⃣ Frontend sends that code → to your backend
This is safe because:
    Code is useless without your Client Secret (which is only in backend)
    Hacker cannot generate a fake Google login


3️⃣ Backend uses OAuth2Client to send the code → to Google



4️⃣ Google verifies the code and sends back:

✔ id_token (contains user info)
✔ access_token
✔ user email, name, picture
Google guarantees this info is 100% valid and not fake.
*/