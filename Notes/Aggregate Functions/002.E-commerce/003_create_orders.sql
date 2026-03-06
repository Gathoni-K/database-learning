CREATE TABLE orders(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    amount INT NOT NULL,
    ordered_at TIMESTAMP NOT NULL
);