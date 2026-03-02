# BUILDING A LIBRARY MANAGEMENT SYSTEM.


## Folder Structure

    migrations/ - contains the database strucutre.
    -where tables are created, altered, dropped etc.
    seeds/ - where the mock data lives
    queries/ - where CRUD operations live.

-A simple library API with the following entities:

1.Books - core entity, has a title, author, genre

2.Members - people registered at the library

3.Loans - relationship between books and members,tracks who borrowed what, when.

Operations covered:

1. CRUD - adding books, registering members, issuing a loan, returning a book, deleting a record.

2.For joins, fetch loans with both the book and book details and member details attached.

## Writing SQL code

1.CREATE TABLE.

    CREATE TABLE table_name(
        first_column dataType,
        second_column dataType
    );


2.DROP TABLE

    DROP TABLE table_name;
    

## Defining constraints

-Helps us the kind of data acceptable in our tables.

-The constraint definition comes after the data type.

**TABLE VS COLUMN CONSTRAINTS.**

-Table constraints apply to the entire table while the latter applies only to the specific column it has been specified in.

Column constraints are written directly after the column definition attached to it:

    book_id UUID NOT NULL REFERENCES books(id)

Table constraints are written separately at the bottom of the table definition after all columns.

    CREATE TABLE loans(
        id UUID PRIMARY KEY,
        member_id UUID NOT NULL,
        book_id UUID NOT NULL,
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (book_id) REFERENCES books(id)
    );

-Note that the 5th line of the above code does the exact same thing as the column constraint defined above.

-Column constraints are cleaner and more readable hence are preferred.

-When are table constraints preferred:

1.When constraints involves multiple columns, as shown in the example above.

2.When a table has too many columns, it is often preferred to put all constraints at the bottom so the column definitions remain clean.


1.CHECK.

- Allows us to specify that the value in a certain column must satisfy a Boolean (truth-value) expression.

-An example is when only positive product prices are required.

    CREATE TABLE products(
        product_no integer,
        name text,
        price numeric CHECK (price > 0)
    );

-The constraint can be given a separate name for easier clarification of error messages.

    price numeric CONSTRAINT positive_price CHECK (price > 0)

-General pattern would be:

    column_name dataType CONSTRAINT constraint_name CHECK (condition)

-A check constraint is satisfied if the check expression evaluates to true or the null value.

-Cannot be used to verify data from another table

    CHECK(member_id EXISTS in members)
    //this is wrong as PostgreSQL does not allow that

-The correct code for that would be

    member_id UUID REFERENCES members(id)
    //foreign keys are used to enforce validity.

-Avoid using functions in check constraints, keep it simple, else the consequences are a bit complex, refer to official PostgreSQL docs.


2.NOT NULL.

-Specifies that a column must not assume a null value.

    CREATE TABLE book(
        book_no integr NOT NULL,
        name text NOT NULL,
        author text NOT NULL
    );

-Just as in the check constraint an explicit constraint name can also be specified here:

    name text CONSTRAINT book_name_not_null NOT NULL,

-In most database designs the majority of the columns should be markes as NOT NULL.

-A column can have more than one constraint, just write out one after the other.


3.UNIQUE.

-Ensures that the data in a column or a group of columns is unique among all the rows in the table.

-Use whenever business rules dictate that a combination of values should not repeat.


4.PRIMARY KEY.

-Indicates tha a column or a group can be used as the unique identifier of the table.

    CREATE TABLE members(
        id UUID PRIMARY KEY,
        ....
    );

    CREATE TABLE table_name(
        a integer,
        b text,
        c integer,
        PRIMARY KEY(a, c)
    );

-A table can have at most one primary key.


5.FOREIGN KEY.

-Specifies a value in a column that must match the values appearing in some row of another tables.

-Used to enforce validity and express the relationship between entities.

    CREATE TABLE table_name(
        a integer PRIMARY KEY,
        b integer,
        c integer,
        FOREIGN KEY(b, c) REFERENCES other_table(c1, c2)
    );

-The number and type of constrained columns need to match the number and type of the referenced columns.

-A table can have more than one foreign key constraint, this is used to implement many-many relationships.

-Behaviours associated with foreign keys:

-Tells PostgreSQL what to do once a column is deleted.

1.CASCADE.

-Delete all children as well.

-Used when the child data is meaningless without the parent data, e.g. deleting all data related to a book if the book is deleted.

    member_id UUID REFERENCES members(id) ON DELETE RESTRICT

2.RESTRICT.

-Do not allow delete if the children still exist, e.g. one cannot delete a member with loans.

-The default behavious is similar to RESTRICT, rejects the delete if related rows exist.


# DATA MANIPULATION.

### Inserting Data.

-When a table is created, it contains no data, data is inserted one row at a time or multiple rows at once.

    INSERT INTO table_name VALUES ();
    //the data values are listed in the order in which the columns appear in the table.
    //this syntax has the drawback that one needs to know the order of the columns in the table.
    //to avoid this, the columns can be listed explicitly as below:

    INSERT INTO table_name (column_name1, column_name1) VALUES (value1, value2);
    //it is usually good practice to list the names

    INSERT INTO table_name DEFAULT VALUES;
    //default values can be requested explicitly for individual columns or for the entire row.
    //remember that default values are defined using the 'DEFAULT' constraint.

-What of inserting data into a table referencing another table like our loans table?

    INSERT INTO table_name(column1, column2)
    VALUES(
        (SELECT id FROM table1 WHERE column1 = "known_value"),
        (SELECT id FROM table2 WHERE column2 = "known_value")
    );


### Updating Data

-Is the modification of data already defined in the database.

-To do this, we need:

1. name of the table and column to update.
2. new value of the column.
3. which row(s) to update.

-One must specify which conditions a row must meet in order to be updated, only if a primary key exists in the table one can reliably address individual rows by choosing a condition matching the primary key.

    UPDATE table_name
    SET column1 = value1, column2 = value2, ...
    WHERE condition;

 ### Deleting Data.

    DELETE FROM table_name WHERE condition;

### Returning data from modified tables.

    <!-- INSERT -->
    INSERT INTRO table_name (column1, column2)
    VALUES (value1, value2)
    RETURNING *;

    <!-- UPDATE -->
    UPDATE table_name
    SET column1 = value1
    WHERE condition
    RETURNING *;

    <!-- DELETE -->
    DELETE FROM table_name
    WHERE condition
    RETURNING *;

-After modifying data and we need a SELECT query to see what was changed or created then we need to use RETURNING instead.


# QUERIES.

## Table Expressions.

-These compute a table, meaning they produce a temporary virtual table that is immediately deleted once the result is delivered.

### FROM

    FROM table_reference [, table_reference [, ...]]

The clause is used to derive a table from one or more other tables given in a comma-separated table reference list.

-Simply tells the table where to get the data from.

-Is used every time we want to retrieve data.

    SELECT * FROM table_name;

### WHERE 

    SELECT column_name FROM table_name
    WHERE condition;

-Is used to filter rows based on a condition.

-Used when one wants specific rows instead of everything in the table.

### JOIN

    SELECT column_name FROM table_name
    JOIN table_two ON table_one.column_name = table_two.column_name;

-Used when one needs data from more than one table at once.

-It connects two tables together based on a related column between them.

### GROUP BY

    SELECT column_name, AGGREGATE_FUNCTION(column_name) FROM table_name
    GROUP BY column_name;

-Used when one wants to group rows sharing the same value and usually perform a calculation on them.

-Is usually paired with aggregate functions.

### HAVING

    SELECT column_name, AGGREGATE_FUNCTION(column_name) FROM table_name
    GROUP BY column_name
    HAVING AGGREGATE_FUNCTION(column_name) condition;

-Is essentially a WHERE clause but for groups.

-Used to filter the results of a GROUP BY.

-All together they would look like this:

    SELECT column_name FROM table_name
    JOIN table_two ON table_one.column_name = table_two.colun_name
    WHERE condition
    GROUP BY column_name
    HAVING AGGREGATE_FUNCTION (column_name) condition;

-An aggregate function is one that takes a bunch of rows and computes a single result from them, common examples are: COUNT, SUM, AVG, MAX, MIN

-Use when the question starts with 'How many', 'What is the total', 'What is the average', 'What is the highest or lowest'


## Select-List

    SELECT column_one, column_two FROM table_name;
    <!-- gets specific columns -->

    SELECT DISTINCT column_name FROM table_name;
    <!-- filters out duplicate values from our result only returning unique values.
    Used when our question begins with 'What are all the unique...' or ''What are all the different' -->

## Combining Queries.

-When combining queries one must ensure that both queries have the same number of columns and compatible data types.

### UNION.

-It's basically, 'Give me the results from query one and query two'

    SELECT column_name FROM table_one
    UNION
    SELECT column_name FROM table_two;

### INTERSECT

-Returns only the rows appearing in both query results.

    SELECT column_name FROM table_one
    INTERSECT
    SELECT column_name FROM table_two;

### EXCEPT

-Returns rows from the first query that do not appear in the second query.

    SELECT column_name FROM table_one
    EXCEPT
    SELECT column_name FROM table_two;


## Sorting Rows.

    SELECT column_name FROM table_name
    ORDER BY column_name ASC;
    <!-- ascending, is the default method -->

    SELECT column_namr FROM table_name
    ORDER BY column_name DESC;
    <!-- arranges rows in descending order -->

    SELECT column_name FROM table_name
    ORDER BY column_name ASC, column_two DESC;
    <!-- sorting by multiple columns -->


    SELECT column_name FROM table_name
    LIMIT number;
    <!-- controls how many rows are returned -->

    SELECT column_name FROM table_name
    LIMIT number OFFSET number;
    <!-- offset tells PostgreSQL how many rows to skip before starting to return results -->

-The most common use case for this is pagination.

 -The pattern is always:

    OFFSET = (page number - 1) * LIMIT


## WITH Queries.(Common Table Expressions)

-A CTE is a temporary named result set defined at the beginning of a query and is referenced within the same query.

-Is giving a subquery a name so that it can be referred to cleanly instead of nesting queries inside each other.

    WITH cte_name AS(
        SELECT column_name FROM table_name
        WHERE condition
    )
    SELECT * FROM cte_name;

### Recursive Queries

-Is one referencing itself.

-It keeps running until there are no more results to return.

-Used when dealing with hierarchical data, data with parent-child relationship that can go many levels deep, e.g. an employee table where every employee has a manager who is also an employee, a category table where categories have subcategories.

    WITH RECURSIVE cte_name AS(
        <!-- the starting point/non-recursive part -->
        SELECT column_name FROM table_name
        WHERE condition

        UNION ALL

        <!-- the recursive part -->
        SELECT column_name FROM table_name
        JOIN cte_name ON condition
    )
    SELECT * FROM cte_name;
    <!-- the second part builds on the previous result until there is nothing left to return -->

### CTE Materialization.

-Is how PostgreSQL decides to execute the CTE behind the scenes.

-Materialized is when PostgreSQL runs the cte once, stores the result temporarily in memory and reuses the stored result every time the cte is referenced.

-Not materialized is when the cte is folded into the main query and is optimized together at once.

    WITH cte_name AS MATERIALIZED(
        SELECT column_name FROM table_name
    )
    SELECT * FROM cte_name;

    WITH cte_name AS NOT MATERIALIZED(
        SELECT column_name FROM table_name
    )
    SELECT * FROM cte_name;

### Data Modifying Statements

-Is used when one wants to modify data and immediately use the affected rows in another query in the same step.

    WITH modified_rows AS(
        INSERT INTO table_name (column_name)
        VALUES (value)
        RETURNING *
    )
    SELECT * FROM modified_rows;
    <!-- note the RETURNING command here as discussed above is used to allow modified rows to be passed into the next part of the query. -->
    