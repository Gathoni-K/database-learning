# SQL Commands and Syntax

## CREATE 

- Creates databases and tables.

    CREATE DATABASE Database_Name;
    //command for creating a database

    CREATE TABLE Table_Name(
        columnName1 datatype,
        columnName2 datatype,
        columnName3 datatype,
        ...
    )

-Datatypes: bigint, int, datetime, char,varchar,text, image

-Difference between char and varchar?

-CHAR always uses the defined length, will add extra characters to ensure that the limit defined has been reached.

-Useful for country codes, ZIP codes.

-Used when every single entry will be the same length.

-Use the latter with Names, emails, addresses, comments.

## ALTER

-Modifies column definitions.

-Used to drop a column from a table, add a new column

    ALTER TABLE Table_Name

    ALTER TABLE Table_Name ADD (
        columnName (dataType (size));
    )
    //adds a column to a table

    ALTER TABLE Table_Name DROP columnName;
    //drops a column from a table

## DROP

- Removes a table from a database

    DROP TABLE Table_Name;


-The above are DDL commands, Data Definition commands that affect the structure of our tables.

-DML, Data Manipulation, commands are listed below, these are responsible for modifying data in our database.

## SELECT.

- Used to query data in the database.

    SELECT columnNames
    FROM Table_Name
    WHERE condition(s)
    ORDER BY columnName ASC | DESC

    SELECT *
    FROM Table_Name;
    //selects all data in the table

-Conditions can be joined using AND / OR.

## INSERT

-Used to insert data into a table.

    INSERT INTO Table_Name
    VALUES (value1, value2....)
    INSERT INTO Table_Name (column1, column2....)
    VALUES(value1, value2....)

## UPDATE

-Used to update data in a table.

    UPDATE Table_Name
    SET column1 = value;
    WHERE some column = some value

## DELETE

    DELETE
    FROM Table_Name
    WHERE condition(s)

-Never write UPDATE / DELETE without a WHERE clause unless one wants to intentionally wipe / change every single row in the table.


## Specifying Constraints on Columns and Tables.

1.Constraints on attributes:

    NOT NULL - attribute may not take a NULL value
    DEFAULT - stores a given default value when no value is specified
    PRIMARY KEY - indicate which attribute forms the primary key
    FOREIGN KEY - indicate which attribute forms a foreign key
    //enforces referential integrity.

2. Referential Integrity constraint - specifies the behavior of child tuples whenever the parent is modified.
   
-Actions to take if referential integrity is violated:

    SET NULL - child tuples foreign key is set to NULL.
    SET DEFAULT - set value of foreign key to some default value.
    CASCADE - child tuples are updated / deleted according to the action taken on the parent tuple.

    