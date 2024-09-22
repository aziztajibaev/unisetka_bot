-- USERS Table
CREATE TABLE users (
    user_id                 SERIAL PRIMARY KEY,
    chat_id                 BIGINT UNIQUE,  -- Make chat_id nullable by default
    name                    VARCHAR(50),
    phone_number            VARCHAR(20) NOT NULL,
    username                VARCHAR(50),
    is_admin                CHAR(1) CHECK (is_admin IN ('Y', 'N')),  -- 'Y' for Yes, 'N' for No
    status                  CHAR(1) CHECK (status IN ('A', 'P', 'R')),  -- 'A' for Active, 'P' for Passive, 'R' for Request
    password                VARCHAR(255), 
    confirm_password        VARCHAR(255),
    menu_type               VARCHAR(50),
    lang                    VARCHAR(10)
);

-- COLORS Table
CREATE TABLE colors (
    color_id                SERIAL PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    price                   DECIMAL(10, 2)
);

-- RAWS Table
CREATE TABLE raws (
    raw_id                  SERIAL PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    price                   DECIMAL(10, 2)
);

-- SETTINGS Table
CREATE TABLE settings (
    code                    VARCHAR(255) PRIMARY KEY,
    value                   VARCHAR(255)
);

-- ORDERS Table
CREATE TABLE orders (
    order_id                SERIAL PRIMARY KEY,
    user_id                 INTEGER REFERENCES users(user_id),
    amount                  DECIMAL(10, 2),
    curr_rate               DECIMAL(10, 2),
    deal_date               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_paid                 CHAR(1) CHECK (is_paid IN ('Y', 'N')),  -- 'Y' for Yes, 'N' for No
    status                  CHAR(1) CHECK (status IN ('N', 'P', 'D', 'F')),  -- 'N' for New, 'P' for In Process, 'D' for Delivered, 'F' for Finished
    additional_size         DECIMAL(10, 2),
    period                  DECIMAL(10, 2)
);

-- ORDER_ITEMS Table
CREATE TABLE order_items (
    item_id                 SERIAL PRIMARY KEY,
    deal_id                 INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,  -- Cascade delete on orders
    height                  DECIMAL(10, 2),  -- Fixed typo: changed "heigth" to "height"
    width                   DECIMAL(10, 2),
    quantity                DECIMAL(10, 2),  -- Fixed typo: changed "quant" to "quantity"
    price                   DECIMAL(10, 2),
    amount                  DECIMAL(10, 2),
    color_id                INTEGER REFERENCES colors(color_id),
    raw_id                  INTEGER REFERENCES raws(raw_id)
);

