import multer from "multer";
const storage=multer.memoryStorage();


// setup is for temporary storage of uploaded files in memory
//multer.memoryStorage() → tells Multer to keep uploaded files in memory (RAM) as Buffer objects instead of saving them on disk.
// This is useful when you don’t want to store files locally, but instead upload them directly to Cloudinary, AWS S3, or any cloud service
// Example: You upload an image → it sits in memory temporarily → you send it to Cloudinary → after upload, memory is cleared.
export const upload=multer({storage:storage});

/**
 app.post("/upload", upload.single("image"), async (req, res) => {
    console.log(req.file); // file is in memory as Buffer
});


🔹 Example workflow

User uploads an image.
Multer stores it in memory (req.file.buffer).
You send that buffer to Cloudinary (or any cloud storage).
Done ✅ (no local file saved).











.single("image") → means:

Handle only one file in the request.
Look for it in the form field with name = "image".
Example (frontend form / Postman / fetch):

<form method="post" enctype="multipart/form-data">
  <input type="file" name="image" />
  <button type="submit">Upload</button>
</form>


After this middleware runs, the uploaded file will be available in req.file inside your Express route.
 */