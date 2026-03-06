-- sql file where only orders above 3 are displayed

SELECT
customers.name,
COUNT(*)
FROM orders
JOIN customers ON orders.customer_id = customers.id
GROUP BY customers.name
HAVING COUNT(*) > 3;