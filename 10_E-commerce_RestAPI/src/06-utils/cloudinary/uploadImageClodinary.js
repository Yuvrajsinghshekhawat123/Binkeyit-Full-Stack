 import cloudinary from "./cloudinary.js";

 export async function uploadImageClodinary(image,folder = "binkeyit") {
    
    if (!image || !image.buffer) throw new Error("No image selete ,please select one");

    const buffer = image.buffer;

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder},
            (error, uploadResult) => {
                if (error) return reject(error);
                return resolve(uploadResult);
            }
        ).end(buffer);
    });

    return uploadImage;
}



/*
Example response from Cloudinary:

{
  "asset_id": "abc123",
  "public_id": "binkeyit/xyz789",
  "version": 1693779990,
  "format": "jpg",
  "resource_type": "image",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1693779990/binkeyit/xyz789.jpg"
}




So basically, this function takes an uploaded image (from frontend, Postman, or file input), uploads it to Cloudinary storage, and returns the uploaded image info (including the URL).


*/