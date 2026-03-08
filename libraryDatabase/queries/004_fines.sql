-- file containing all queries concerning the fines table

-- query for counting total fines owned by members
SELECT
    members.name,
    SUM(price)
FROM fines
JOIN members
ON fines.member_id = members.id
GROUP BY members.name
ORDER BY SUM(price) DESC;