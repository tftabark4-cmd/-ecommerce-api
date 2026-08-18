CREATE TABLE users (
id BIGSERIAL PRIMARY KEY,
full_name VARCHAR(150) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(20),
password_hash TEXT,
role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
is_active BOOLEAN NOT NULL DEFAULT TRUE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categories(
id BIGSERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE,
description TEXT,
is_active BOOLEAN NOT NULL DEFAULT TRUE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE products (
id BIGSERIAL PRIMARY KEY,
category_id BIGINT NOT NULL REFERENCES categories(id),
name VARCHAR(200) NOT NULL,
description TEXT,
price NUMERIC(10,2) NOT NULL CHECK (price > 0),
stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
sku VARCHAR(50) UNIQUE,
is_active BOOLEAN NOT NULL DEFAULT TRUE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id),
status VARCHAR(30) NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
total_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
shipping_address TEXT NOT NULL,
notes TEXT,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE order_items (
id BIGSERIAL PRIMARY KEY,
order_id BIGINT NOT NULL REFERENCES orders(id),
product_id BIGINT NOT NULL REFERENCES products(id),
quantity INTEGER NOT NULL CHECK (quantity > 0),
unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
CONSTRAINT uq_order_product UNIQUE (order_id, product_id)
);
CREATE TABLE payments (
id BIGSERIAL PRIMARY KEY,
order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id),
payment_method VARCHAR(30) NOT NULL
CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'wallet')),
payment_status VARCHAR(30) NOT NULL DEFAULT 'pending'
CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
transaction_reference VARCHAR(100) UNIQUE,
paid_at TIMESTAMP,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);