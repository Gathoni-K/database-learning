-- sql file showing the total number of sales per salesperson except it shows only those above 10k worth in sales

SELECT
salesperson.name,
SUM(amount)
FROM sales
JOIN salesperson
    ON sales.salesperson_id = salesperson.id
GROUP BY salesperson.name
HAVING SUM(amount) > 10000;