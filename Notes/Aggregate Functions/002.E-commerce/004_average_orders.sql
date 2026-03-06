-- sql file where we find the average order per customer

SELECT
customers.name,
AVG(amount)
FROM orders
JOIN customers ON orders.customer_id = customers.id
GROUP BY customers.name;
