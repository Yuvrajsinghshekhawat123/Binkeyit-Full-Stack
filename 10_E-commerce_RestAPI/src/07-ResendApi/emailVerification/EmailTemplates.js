 export const emailVerificationTemplate = (userName, code) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; margin:0; padding:0;">
      <div style="max-width:600px; margin:20px auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        
        <h2 style="color:#333;">Email Verification</h2>
         
        <p style="color:#555;">
          Hi <strong>${userName}</strong>,
        </p>

        <p style="color:#555;">
          We received a request to verify your email. Please use the code below:
        </p>

        <div style="text-align:center; margin:30px 0;">
          <span 
             style="background:#007bff; color:#fff; padding:12px 20px; font-weight:bold; border-radius:5px; display:inline-block; font-size:18px; letter-spacing:2px;">
             ${code}
          </span>
        </div>

        <p style="color:#555;">
          If you did not request email verification, please ignore this message or contact support.
        </p>

        <hr style="margin:20px 0;"/>
        <p style="font-size:12px; color:#aaa; text-align:center;">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </p>
      </div>
    </body>
  </html>
`;
