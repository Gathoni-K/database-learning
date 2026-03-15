# Library Management System — SQL Deep Dive

A learning project built to develop a solid understanding of SQL fundamentals using PostgreSQL, before moving into backend development. The project is structured around a simple library management system with books, members, loans, and fines.

---

## Project Goal

To deeply understand relational databases and SQL before introducing a backend layer. Every query, schema decision, and constraint was written by hand and reasoned through from first principles.

---

## Folder Structure

```
library-management-system/
├── migrations/         # Table definitions — CREATE, ALTER, DROP
├── seeds/              # Mock data — INSERT statements
└── queries/            # CRUD operations grouped by entity
    ├── books.sql
    ├── members.sql
    ├── loans.sql
    └── fines.sql
```

---

## Entities

### Books
Core entity. Stores information about available books.
```sql
CREATE TABLE books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL
);
```

### Members
People registered at the library.
```sql
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);
```

### Loans
Relationship between books and members. Tracks who borrowed what and when.
```sql
CREATE TABLE loans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE RESTRICT,
    book_id UUID REFERENCES books(id) ON DELETE RESTRICT,
    borrowed_at TIMESTAMP DEFAULT now() NOT NULL,
    returned_at TIMESTAMP NULL,
    due_date TIMESTAMP NOT NULL
);
```

### Fines
Tracks fines owed by members.
```sql
CREATE TABLE fines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE RESTRICT,
    price INT NOT NULL
);
```

---

## Concepts Covered

### Schema Design
- Defining tables with appropriate data types
- Column vs table constraints and when to use each
- Primary keys and foreign keys
- `ON DELETE RESTRICT` vs `ON DELETE CASCADE` and when each is appropriate
- Avoiding circular references between tables
- `NOT NULL`, `UNIQUE`, `CHECK` constraints

### Data Manipulation
- `INSERT` with explicit column listing
- Inserting into tables with foreign keys using subqueries
- `UPDATE` with `WHERE` conditions
- `DELETE` with `WHERE` conditions
- `RETURNING` to fetch modified rows immediately after a change

### Querying
- `SELECT` with column filtering
- `WHERE` for row-level filtering
- `JOIN` to connect related tables via foreign keys
- Understanding which table to start `FROM` — the table holding the thing being counted or aggregated
- `ORDER BY` with `ASC` and `DESC`
- `LIMIT` and `OFFSET` for pagination
- `DISTINCT` for unique values

### Aggregate Functions
| Function | Answers |
|---|---|
| `COUNT(*)` | How many rows? |
| `SUM(column)` | How much in total? |
| `AVG(column)` | What is the average? |
| `MAX(column)` | What is the highest value? |
| `MIN(column)` | What is the lowest value? |

- `GROUP BY` — grouping rows by a column before aggregating
- `HAVING` — filtering on aggregate results after grouping
- Difference between `WHERE` (filters before grouping) and `HAVING` (filters after grouping)
- `COUNT(*)` vs `COUNT(column)` — the latter excludes NULLs
- `COUNT(*)` vs `SUM(column)` — count asks how many, sum asks how much

### Subqueries
- Used when a value needs to be looked up rather than provided directly
- Required when inserting rows that depend on foreign keys and only a name or title is known

### NULL Handling
- Why `IS NULL` and `IS NOT NULL` must be used instead of `= NULL`
- NULL as the absence of a value, not an empty string or zero

### Combining Queries
- `UNION` — results from both queries
- `INTERSECT` — only rows appearing in both
- `EXCEPT` — rows in the first query not in the second

### Common Table Expressions (CTEs)
- `WITH` — giving a subquery a name for cleaner, more readable queries
- Recursive CTEs for hierarchical data
- Materialized vs not materialized CTEs

### Indexes
- B-Tree, Hash, GIN, GiST, BRIN index types and when to use each
- Composite and partial indexes
- Covering indexes with `INCLUDE`
- Trade-off between read speed and write performance
- `EXPLAIN ANALYZE` for performance analysis

---

## Key Queries Written

```sql
-- Fetch all overdue loans with member and book details
SELECT
    members.name AS member_name,
    books.title AS book_title,
    loans.due_date
FROM loans
JOIN members ON loans.member_id = members.id
JOIN books ON loans.book_id = books.id
WHERE loans.due_date < NOW() AND loans.returned_at IS NULL;

-- Count books borrowed per member
SELECT
    members.name,
    COUNT(*)
FROM loans
JOIN members ON loans.member_id = members.id
GROUP BY members.name
ORDER BY COUNT(*) DESC;

-- Find the most borrowed book
SELECT
    books.title,
    COUNT(*)
FROM loans
JOIN books ON loans.book_id = books.id
GROUP BY books.title
ORDER BY COUNT(*) DESC;

-- Total fines owed per member
SELECT
    members.name,
    SUM(price)
FROM fines
JOIN members ON fines.member_id = members.id
GROUP BY members.name
ORDER BY SUM(price) DESC;
```

---

## How to Test

No backend is needed at this stage. You can run everything directly against a PostgreSQL database using any of the following tools:

- **psql** — PostgreSQL's built-in command line tool


### Steps
1. Create a PostgreSQL database
2. Run the files in `migrations/` to create your tables
3. Run the files in `seeds/` to populate with mock data
4. Run the files in `queries/` to test your queries

---

## Next Steps

- Set up a live PostgreSQL database and run the schema
- 
- Build a backend API (Node.js + Express) to expose queries as endpoints
- Add a simple frontend interface for librarians to interact with the system



# PHASE 2.

## CONNECTING OUR DATABASE TO THE BACKEND.

### Setup.

-Installed the supabase CLI using:

    yay -Syu supabase bin

-Confirm installation using:

    supabase -v

-Navigate to project folder then run:

    supabase init

-Link to Supabase using:

    supabase link

-For this to work, ensure that you are logged in and have your access token, do so by:

    supabase login

-Generate a new access token that will be used, then run the link command once again.

-Select the project you want to link to.

-One token = access to entire Supabase account and should thus not be pushed to Github.

-The correct flow is thus:

    supabase login (token)
      ↓
    authenticates your ACCOUNT
        ↓
    supabase link
        ↓
    picks a specific PROJECT from your account

-On Supabase, connect our database, we will use DIrect connection.

-Copy credentials in .env file, ensure this file is included in our '.gitignore'

-Install pg using:

    npm install pg
    npm install --save-dev @types/pg

-Create the db.ts file under 'src/config'

