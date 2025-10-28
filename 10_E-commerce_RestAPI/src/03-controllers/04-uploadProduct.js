import {
  deleteImageFromCloudinaryAndDB,
  deleteProduct,
  getAllProductsFromDB,
  getProductById,
  getProductsByCategoryAndSubCategory,
  getProductsByCategoryId,
  insertNewImagesWithOld,
  insertProductDetails,
  searchProducts,
  updateMainProductInfo,
} from "../02-models/07-products.js";
import { uploadImageClodinary } from "../06-utils/cloudinary/uploadImageClodinary.js";

export async function UploadProduct(req, res) {
  try {
    const {
      subCategoryName,
      ParentcategoryName,
      categoryId,
      SubcategoryId,
      name,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
      fields,
    } = req.body;

    // ✅ Uploaded files
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedImages = await Promise.all(
      files.map((file) => uploadImageClodinary(file, "Products"))
    );

    // ✅ Extract secure URLs & IDs
    const imageUrls = uploadedImages.map((image) => ({
      url: image.url,
      publicId: image.public_id,
    }));

    // insert product

    await insertProductDetails(
      name,
      subCategoryName,
      ParentcategoryName,
      JSON.stringify(imageUrls),
      categoryId,
      SubcategoryId,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
      fields
    );

    return res.status(201).json({
      success: true,
      message: "Product details inserted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/*
const [rows] = await db.execute("SELECT * FROM products WHERE id=?", [productId]);

if (rows.length > 0) {
  const product = rows[0];
  product.images = JSON.parse(product.images); // convert back to array
  console.log(product.images[0].url); // first image
}



*/

export async function getAllProducts(req, res) {
  try {
    const result = await getAllProductsFromDB();
    const Products = result.map((product) => ({
      id: product.id,
      name: product.name,
      image: safeParse(product.images, []), // If image or fields is empty (NULL, "", or not valid JSON)--> That will hit your catch and return 500 Internal Server Error.
      CategoryName: product.CategoryName,
      subCategoryName: product.subCategoryName,
      categoryId: product.categoryId,
      sub_categoryId: product.sub_categoryId,
      unit: product.unit,
      stock: product.stock,
      price: product.price,
      discount: product.discount,
      description: product.description,
      more_details: product.more_details,
      fields: safeParse(product.fields, []), // safer
      publish: product.publish,
    }));

    return res.status(200).json({
      success: true,
      Products: Products, //  // return all categories
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ utility function to avoid crashing
function safeParse(value, fallback) {
  try {
    //  // If image or fields is empty (NULL, "", or not valid JSON)--> That will hit your catch and return 500 Internal Server Error.
    return value ? value : fallback; // mysql2 automatically parses JSON columns into a JavaScript object/array for you! ✅ // That’s why if you do JSON.parse(product.image) now, you get an error — you’re trying to parse an object, not a string.
  } catch {
    console.log(value);

    // If the DB accidentally has invalid JSON (e.g., "not_json", "{"key":}"), it will still crash and go to catch.
    return fallback;
  }
}

export async function deleteProductById(req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    // find record by id
    const record = await getProductById(id);

    if (!record || record.length === 0) {
      return res
        .status(409)
        .json({ success: false, message: "Product not found" });
    }

    const result = await deleteProduct(id);

    if (!result.success) {
      return res.status(500).json(result); // pass along the failure message from deleteProduct
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// edit product
export async function editProdcut(req, res) {
  try {
    const {
      id,
      subCategoryName,
      ParentcategoryName,
      categoryId,
      SubcategoryId,
      name,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
      fields,
      deleted_images,
    } = req.body;

    // ✅ Uploaded files

    const files = req.files; // uploaded new images

    const record = await getProductById(id);
    if (!record || record.length === 0) {
      return res
        .status(409)
        .json({ success: false, message: "Product not found" });
    }

    const oldProduct = record[0]; // old values

    // Use new value if provided, else fallback to old

    const updatedProduct = {
      name: name || oldProduct.name,
      CategoryName: ParentcategoryName || oldProduct.CategoryName,
      subCategoryName: subCategoryName || oldProduct.subCategoryName,
      unit: unit || oldProduct.unit,
      stock: stock || oldProduct.stock,
      price: price || oldProduct.price,
      discount: discount || oldProduct.discount,
      description: description || oldProduct.description,
      more_details: moreDetails || oldProduct.more_details,

      // ✅ Fields and images safely parsed
      fields: fields && fields.length ? fields : oldProduct.fields,
    };

    await updateMainProductInfo(
      id,
      updatedProduct.name,
      updatedProduct.CategoryName,
      updatedProduct.subCategoryName,
      updatedProduct.unit,
      updatedProduct.stock,
      updatedProduct.price,
      updatedProduct.discount,
      updatedProduct.description,
      updatedProduct.more_details,
      updatedProduct.fields
    );

    // Ensure deleted_images is always an array
    let deletedImagesArray = [];

    if (deleted_images) {
      // If it's already an array, use it
      if (Array.isArray(deleted_images)) {
        deletedImagesArray = deleted_images;
      } else {
        // If it's a single value (string or number), wrap it in an array
        deletedImagesArray = [deleted_images];
      }
    }

    for (const public_id of deletedImagesArray) {
      await deleteImageFromCloudinaryAndDB(id, public_id);
    }

    if (files && files.length !== 0) {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadImageClodinary(file, "Products"))
      );

      // ✅ Extract secure URLs & IDs
      const imageUrls = uploadedImages.map((image) => ({
        url: image.url,
        publicId: image.public_id,
      }));

      await insertNewImagesWithOld(id, imageUrls);
    }

    return res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// get products by catgegory id
export async function getProductByCategory(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const result = await getProductsByCategoryId(id);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    const Products = result.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.images,
      subCategoryName: product.subCategoryName,
      categoryId: product.categoryId,
      CategoryName: product.CategoryName,
      sub_categoryId: product.sub_categoryId,
      unit: product.unit,
      stock: product.stock,
      price: product.price,
      discount: product.discount,
      description: product.description,
      more_details: product.more_details,
      fields: product.fields, // safer
      publish: product.publish,
    }));

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      Products: Products, //  // return all categories
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// get All product by categoryId and subCategoryId
export async function getProductByCategoryidAndSubcategoryid(req, res) {
  try {
    let { categoryId, subCategoryId, page, limit } = req.body;
    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "Both categoryId and subCategoryId are required.",
      });
    }

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const result = await getProductsByCategoryAndSubCategory(
      categoryId,
      subCategoryId
    );

    // 4️⃣ Apply pagination manually
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResult = result.slice(startIndex, endIndex);

    const Products = paginatedResult.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.images,
      categoryId: product.categoryId,
      CategoryName: product.CategoryName,
      subCategoryName: product.subCategoryName,
      sub_categoryId: product.sub_categoryId,
      unit: product.unit,
      stock: product.stock,
      price: product.price,
      discount: product.discount,
      description: product.description,
      more_details: product.more_details,
      fields: product.fields, // safer
      publish: product.publish,
    }));

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      Products: Products, //  // return all categories
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// get product by id
export async function getProductByProductId(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required.",
      });
    }

    const result = await getProductById(id);

    // ✅ Check if product exists
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const Product = {
      id: result[0].id,
      name: result[0].name,
      image: result[0].images,
      categoryId: result[0].categoryId,
      CategoryName: result[0].CategoryName,
      subCategoryName: result[0].subCategoryName,
      sub_categoryId: result[0].sub_categoryId,
      unit: result[0].unit,
      stock: result[0].stock,
      price: result[0].price,
      discount: result[0].discount,
      description: result[0].description,
      more_details: result[0].more_details,
      fields: result[0].fields, // safer
      publish: result[0].publish,
    };

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      Product: Product, //  // return all categories
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}








// get product by search name in input box
export async function   getProductsBySearchName(req, res) {
  try {
    const q = req.query.q || ""; // search text
     const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    

  

  

    const results = await searchProducts(q, limit, page);

       if (!results.length) {
  return res.status(200).json({ Products: [], message: "No products found" });
}


    


    const Products = results.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.images,
      categoryId: product.categoryId,
      CategoryName: product.CategoryName,
      subCategoryName: product.subCategoryName,
      sub_categoryId: product.sub_categoryId,
      unit: product.unit,
      stock: product.stock,
      price: product.price,
      discount: product.discount,
      description: product.description,
      more_details: product.more_details,
      fields: product.fields, // safer
      publish: product.publish,
    }));


    
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      Products: Products, //  // return all categories

    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
