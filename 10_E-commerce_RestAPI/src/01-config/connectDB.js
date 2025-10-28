import mysql2 from "mysql2/promise";

let db=null;


export async function connectDB() {
    try{
         db=await mysql2.createConnection({
            host:"localhost",
            user:"root",
            password:"123240",
            database:"e-commerse"
        });

        console.log("MySql connected successfully")
    }catch(err){
        console.error("Failed to connect to DB:", err);
    }
}



export function getDB(){
    if(!db) throw new Error("DB not initialized");
    return db;
}







/*


// create user table

 db.execute(`
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    avatar VARCHAR(100) DEFAULT NULL,
    mobile VARCHAR(10) DEFAULT NULL,
    verify_email BOOLEAN DEFAULT FALSE,
    last_login_date DATE DEFAULT NULL,
    status ENUM('active','inactive','suspended') DEFAULT 'active',
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL DEFAULT NULL
  )
`)

*/





/*
// email verification 
 db.execute(` create table emailVerification (
    id int auto_increment primary key,
    user_id int,
    token varchar(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    
`)
*/









/*
// create address table


db.execute(`
    CREATE TABLE address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    address_line VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    mobile VARCHAR(15),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

`)


//👉 Explanation:
//    .user_id in address table references users(user_id) → so one user can have many addresses.
//    .if a user is deleted, ON DELETE CASCADE ensures their addresses are also deleted.



// Example:
// INSERT INTO users (name, email) VALUES ('Rahul', 'rahul@example.com');

// INSERT INTO address (user_id, address_line, city, state, country, pincode, mobile)
// VALUES (1, '123 Street', 'Mumbai', 'Maharashtra', 'India', '400001', '9876543210');
        //  This means User 1 now has one address. You can add more rows for multiple addresses.


*/





/*
cartProduct table


CREATE TABLE cart_product (
    cart_product_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);



// 👉 Explanation:
    // Instead of storing shopping_cart inside users, we keep a separate cart_product table.
    // Each row = 1 product in 1 user’s cart.
    // user_id → tells which user owns the cart item.
    // product_id → links to the actual product.




//-- User adds product 5 to cart with quantity 2
//INSERT INTO cart_product (user_id, product_id, quantity) VALUES (1, 5, 2);

// -- User adds product 8 to cart with quantity 1
// INSERT INTO cart_product (user_id, product_id, quantity) VALUES (1, 8, 1);


//    Now User 1’s cart has 2 items:
//        Product 5 → qty 2
//        Product 8 → qty 1
*/








/*

// create categroy table
db.execute(`
    CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE, -- Category name (e.g., Electronics, Clothing)
    image VARCHAR(255),                -- Optional category image (store URL/path)
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
);




// The image column in the Category table is optional and used mainly for UI/UX purposes.
//     For example:
//     If you have a category like Electronics, you can show an icon/image (📱 a mobile image, 💻 a laptop image) along with the name.



*/
/*
// create sub_categories
db.execute(`
    CREATE TABLE sub_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,       -- Subcategory name (e.g., Mobile Phones, Laptops)
   categoryName 
    categoryId INT NOT NULL,          -- Parent category reference

    image VARCHAR(255) NULL DEFAULT NULL,
    public_id VARCHAR(255) NULL DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
    FOREIGN KEY (categoryId) REFERENCES categories(id)
    ON DELETE CASCADE               -- If category is deleted, subcategories go too
);

`)

*/







/*
// order table

db.execute(`
    CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    orderId VARCHAR(50) UNIQUE,
    product_details JSON,
    payment_id VARCHAR(100),
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
    delivery_address TEXT,
    delivery_status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
    subTotalAmt DECIMAL(10,2),
    totalAmt DECIMAL(10,2),
    invoice_receipt VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);`)

//Q-1 you’re asking why we store JSON here instead of just productId.
// 👉 Example:

//     Product price today: ₹1000
//     Tomorrow price updated: ₹1200
//     If you only store productId, when user views past order, it will incorrectly show ₹1200 instead of ₹1000 (the price at purchase time)

// 2️⃣ If we store product_details JSON
//  At the time of order, you can store a snapshot of important product info:
    // [
    //   { "productId": 12, "name": "iPhone 14", "price": 1000, "qty": 1 },
    //   { "productId": 15, "name": "AirPods", "price": 200, "qty": 2 }
    // ]


// This way:
//     You know exactly what was purchased.
//     You preserve historical data (price, name, qty at purchase time).
//     Even if product is deleted later, your order record is still complete.






// Q-2  Why delivery_address TEXT even if we have an address table?
// When a user places an order, the shipping address must be locked (snapshot).
// If we only store a foreign key to the address table, then:
//         If the user later edits/deletes that address → old orders would point to the wrong or updated address.
//         This would create issues in order history, shipping records, and invoices

// That’s why we usually store the actual delivery address inside the order record (as TEXT or JSON) at the time of placing the order.
// It ensures that even if the user changes their address later, the order still shows the exact address it was shipped to.



// Q-3 Why have an Address Table if we also store delivery_address inside Orders?

//✅ So the flow is:
// User has multiple addresses in address table.
// At checkout, they select one.
// System copies that address into orders.delivery_address → frozen snapshot.
// Even if user edits/deletes the saved address later → order still has correct shipping info.

*/







/*

For Cash on Delivery (COD)

Since no payment is made yet, you should skip or mark these as pending 👇



| Column                                                           | Example Value                                     | Action                        |
| ---------------------------------------------------------------- | ------------------------------------------------- | ----------------------------- |
| `payment_id`                                                     | `NULL`                                            | ❌ Skip (no online payment ID) |
| `payment_status`                                                 | `'Pending'`                                       | ✅ Set as pending              |
| `invoice_receipt`                                                | `NULL` *(or ‘PROFORMA-20251024-101’ if you want)* | ❌ Skip or temporary           |
| `delivery_status`                                                | `'Pending'`                                       | ✅                             |
| `product_details`, `subTotalAmt`, `totalAmt`, `delivery_address` | ✅ Store normally                                  |                               |







✅ Later, after delivery & cash received:

        UPDATE Orders
    SET payment_status = 'Completed',
        invoice_receipt = 'INV-20251026-103'
    WHERE orderId = 'ORD-20251024-103';





*/














/*
// product table

db.execute(`CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    images  Json,       
    CategoryName VARCHAR(255) DEFAULT NUL
    subCategoryName VARCHAR(255) DEFAULT NUL,

    categoryId INT NOT NULL,
    sub_categoryId INT DEFAULT NULL,

    unit VARCHAR(50), -- e.g., kg, piece
    stock INT NOT NULL DEFAULT 0,

    price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(5,2) DEFAULT 0.00, -- percentage or flat depending on logic

  description TEXT,
  more_details TEXT,
  fields Json,

  publish BOOLEAN DEFAULT TRUE,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (sub_categoryId) REFERENCES sub_categories(id)
);
`)



// 📌 Notes:
//     . id → Product ID (primary key).
//     . categoryId, sub_categoryId → Reference to categories & sub_categories tables.
//     . unit → e.g., "kg", "piece", "litre".
//     . stock → Current quantity.
//     . price, discount → Stored separately for flexibility.
//     . publish → Boolean flag for visibility.
//     . createdAt, updatedAt → Auto-handled timestamps.


// It means publish is just a flag (true/false) in your products table that decides whether the product should be visible to users/customers or not.
// publish = TRUE (1) → Product is active/visible (shown on website/app)
// publish = FALSE (0) → Product is inactive/hidden (not shown to users, but still exists in database).

 

*/





 

