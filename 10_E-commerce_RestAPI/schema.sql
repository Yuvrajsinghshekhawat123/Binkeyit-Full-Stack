
USE railway;


-- =========================
-- 1. USERS
-- =========================
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255),
  avatar_public_id VARCHAR(255),
  avatar VARCHAR(100),
  mobile VARCHAR(10),
  verify_email TINYINT(1) DEFAULT 0,
  last_login_date DATE,
  status ENUM('active','inactive','suspended') DEFAULT 'active',
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB;

-- =========================
-- 2. CATEGORIES
-- =========================
CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  image VARCHAR(255),
  public_id VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB;

-- =========================
-- 3. SUB CATEGORIES
-- =========================
CREATE TABLE sub_categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  categoryName VARCHAR(255),
  categoryId INT NOT NULL,
  image VARCHAR(255),
  public_id VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY name_category (name, categoryId),
  KEY categoryId (categoryId),
  CONSTRAINT sub_categories_ibfk_1
    FOREIGN KEY (categoryId)
    REFERENCES categories (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 4. PRODUCTS
-- =========================
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  images JSON,
  CategoryName VARCHAR(255),
  subCategoryName VARCHAR(255),
  categoryId INT NOT NULL,
  sub_categoryId INT,
  unit VARCHAR(50),
  stock INT DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(5,2) DEFAULT 0.00,
  description TEXT,
  more_details TEXT,
  publish TINYINT(1) DEFAULT 1,
  fields JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY categoryId (categoryId),
  KEY sub_categoryId (sub_categoryId),
  CONSTRAINT products_ibfk_1
    FOREIGN KEY (categoryId)
    REFERENCES categories (id)
    ON DELETE CASCADE,
  CONSTRAINT products_ibfk_2
    FOREIGN KEY (sub_categoryId)
    REFERENCES sub_categories (id)
) ENGINE=InnoDB;

-- =========================
-- 5. ADDRESS
-- =========================
CREATE TABLE address (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  address_line VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  pincode VARCHAR(20),
  mobile VARCHAR(15),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT address_ibfk_1
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 6. CART PRODUCT
-- =========================
CREATE TABLE cart_product (
  cart_product_id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (cart_product_id),
  KEY user_id (user_id),
  KEY product_id (product_id),
  CONSTRAINT cart_product_ibfk_1
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT cart_product_ibfk_2
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 7. ORDERS
-- =========================
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT,
  orderId VARCHAR(50),
  product_details JSON,
  payment_id VARCHAR(100),
  payment_status ENUM('Pending','Completed','Failed','Refunded'),
  delivery_address TEXT,
  delivery_status ENUM('Pending','Shipped','Delivered','Cancelled'),
  subTotalAmt DECIMAL(10,2),
  totalAmt DECIMAL(10,2),
  invoice_receipt VARCHAR(100),
  payment_method ENUM('COD','Online') NOT NULL DEFAULT 'COD',
  trackingNumber VARCHAR(50),
  shippingLabelUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY orderId (orderId),
  KEY userId (userId),
  CONSTRAINT orders_ibfk_1
    FOREIGN KEY (userId)
    REFERENCES users (id)
) ENGINE=InnoDB;

-- =========================
-- 8. SESSIONS
-- =========================
CREATE TABLE sessions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  valid TINYINT(1) DEFAULT 1,
  user_agent TEXT,
  ip VARCHAR(45),
  refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT sessions_ibfk_1
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 9. EMAIL VERIFICATION
-- =========================
CREATE TABLE emailverification (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  isVerified TINYINT(1) DEFAULT 0,
  expiresAt DATETIME NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB;

-- =========================
-- 10. FORGOT PASSWORD
-- =========================
CREATE TABLE forgot_password (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  otp VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY user_id (user_id),
  CONSTRAINT forgot_password_ibfk_1
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
