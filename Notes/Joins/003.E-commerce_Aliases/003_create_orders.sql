CREATE TABLE orders(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT
);

SELECT
customers.name AS name,
customers.email AS email,
products.title AS title,
products.price AS price
FROM orders
JOIN customers
    ON orders.customer_id = customers.id
JOIN products
    ON orders.product_id = products.id;